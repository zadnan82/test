# user_backend/app/services/sevdo_service.py - NETWORK-AWARE VERSION

import httpx
import os
from typing import List, Dict, Any
from user_backend.app.core.logging_config import StructuredLogger

logger = StructuredLogger(__name__)


class SevdoIntegrationService:
    """Service to integrate SEVDO code generation with user backend"""

    def __init__(self):
        # Try Docker service names first, fallback to localhost
        self.sevdo_backend_urls = [
            os.getenv("SEVDO_BACKEND_URL", "http://sevdo-backend:8001"),
            "http://localhost:8001",
            "http://host.docker.internal:8001",
        ]
        self.sevdo_frontend_urls = [
            os.getenv("SEVDO_FRONTEND_URL", "http://sevdo-frontend:8002"),
            "http://localhost:8002",
            "http://host.docker.internal:8002",
        ]
        self.timeout = 10.0
        self._working_backend_url = None
        self._working_frontend_url = None

    async def _find_working_backend_url(self):
        """Find the first working backend URL"""
        if self._working_backend_url:
            return self._working_backend_url

        for url in self.sevdo_backend_urls:
            try:
                async with httpx.AsyncClient() as client:
                    response = await client.get(f"{url}/health", timeout=5.0)
                    if response.status_code == 200:
                        logger.info(f"Backend service found at: {url}")
                        self._working_backend_url = url
                        return url
            except Exception as e:
                logger.debug(f"Backend URL {url} failed: {e}")
                continue

        raise Exception("No working backend service found")

    async def _find_working_frontend_url(self):
        """Find the first working frontend URL"""
        if self._working_frontend_url:
            return self._working_frontend_url

        for url in self.sevdo_frontend_urls:
            try:
                async with httpx.AsyncClient() as client:
                    response = await client.get(f"{url}/health", timeout=5.0)
                    if response.status_code == 200:
                        logger.info(f"Frontend service found at: {url}")
                        self._working_frontend_url = url
                        return url
            except Exception as e:
                logger.debug(f"Frontend URL {url} failed: {e}")
                continue

        raise Exception("No working frontend service found")

    async def generate_backend_code(
        self, tokens: List[str], include_imports: bool = True
    ):
        try:
            backend_url = await self._find_working_backend_url()

            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{backend_url}/api/translate/to-s-direct",
                    json={
                        "tokens": tokens,
                        "include_imports": include_imports,
                        "use_cache": True,
                    },
                    timeout=self.timeout,
                )
                response.raise_for_status()

                result = response.json()
                return {
                    "success": True,
                    "code": result["generated_code"],
                    "tokens": tokens,
                    "metadata": result,
                }
        except Exception as e:
            logger.error(f"Backend generation failed: {str(e)}")
            return {"success": False, "error": str(e)}

    async def generate_frontend_code(
        self,
        dsl_content: str,
        include_imports: bool = True,
        component_name: str = "GeneratedComponent",
    ) -> Dict[str, Any]:
        """Generate frontend code using SEVDO frontend service with automatic URL discovery"""

        try:
            frontend_url = await self._find_working_frontend_url()

            async with httpx.AsyncClient() as client:
                logger.info(f"Generating frontend using: {frontend_url}")
                logger.info(f"DSL content: {dsl_content[:100]}...")

                payload = {
                    "dsl_content": dsl_content,
                    "include_imports": include_imports,
                    "component_name": component_name,
                    "use_cache": True,
                }

                response = await client.post(
                    f"{frontend_url}/api/fe-translate/to-s-direct",
                    json=payload,
                    timeout=self.timeout,
                    headers={
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                )

                logger.info(f"Frontend response status: {response.status_code}")

                if response.status_code != 200:
                    error_text = response.text
                    logger.error(f"Frontend service error: {error_text}")
                    # Reset the working URL so we try others next time
                    self._working_frontend_url = None
                    raise Exception(
                        f"Frontend service error {response.status_code}: {error_text}"
                    )

                result = response.json()

                if result.get("success"):
                    logger.info("Frontend generated successfully")
                    return {
                        "success": True,
                        "code": result["code"],
                        "component_name": component_name,
                        "metadata": result,
                    }
                else:
                    raise Exception(f"Frontend service returned error: {result}")

        except Exception as e:
            logger.error(f"Frontend generation failed: {str(e)}")
            # Reset working URL for next attempt
            self._working_frontend_url = None
            return {"success": False, "error": str(e)}

    async def generate_full_project(
        self,
        project_name: str,
        backend_tokens: List[str],
        frontend_dsl: str = None,
        include_imports: bool = True,
    ) -> Dict[str, Any]:
        """Generate both backend and frontend code for a complete project"""

        results = {
            "project_name": project_name,
            "backend": None,
            "frontend": None,
            "success": False,
            "errors": [],
        }

        # Generate backend code
        logger.info(f"Generating backend for project: {project_name}")
        backend_result = await self.generate_backend_code(
            backend_tokens, include_imports
        )
        results["backend"] = backend_result

        if not backend_result.get("success"):
            results["errors"].append(
                f"Backend: {backend_result.get('error', 'Unknown error')}"
            )

        # Generate frontend code if DSL provided
        if frontend_dsl and frontend_dsl.strip():
            logger.info(f"Generating frontend for project: {project_name}")
            frontend_result = await self.generate_frontend_code(
                frontend_dsl,
                include_imports,
                f"{project_name.replace(' ', '')}Component",
            )
            results["frontend"] = frontend_result

            if not frontend_result.get("success"):
                results["errors"].append(
                    f"Frontend: {frontend_result.get('error', 'Unknown error')}"
                )
        else:
            logger.info("No frontend DSL provided, skipping frontend generation")

        # Determine overall success
        results["success"] = (
            results["backend"] and results["backend"].get("success", False)
        ) or (results["frontend"] and results["frontend"].get("success", False))

        if results["success"]:
            logger.info(f"Project {project_name} generated successfully!")
        else:
            logger.warning(
                f"Project {project_name} completed with errors: {results['errors']}"
            )

        return results


# Create singleton instance
sevdo_service = SevdoIntegrationService()
