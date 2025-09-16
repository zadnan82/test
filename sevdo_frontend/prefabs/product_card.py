# sevdo_frontend/prefabs/product_card.py
def render_prefab(args, props):
    # Defaults
    name = props.get("name", "Product")
    price_raw = props.get("price", "0.00")
    image = props.get("image", "")
    currency = props.get("currency", "$")
    button_text = props.get("buttonText", "Add to Cart")
    cart_key = props.get("cartKey", "sevdoCart")
    id_ = props.get("id", "")

    # Accept inline args like: pc(name=..., price=..., image=...)
    if args:
        raw = args.strip()
        if raw:
            parts = [p.strip() for p in raw.split(",") if p.strip()]
            inline = {}
            for p in parts:
                if "=" in p:
                    k, v = p.split("=", 1)
                    inline[k.strip()] = v.strip()
            name = inline.get("name", name)
            price_raw = inline.get("price", price_raw)
            image = inline.get("image", image)
            currency = inline.get("currency", currency)
            id_ = inline.get("id", id_)

    # Optional backend override
    add_path = props.get("addPath")
    add_method = (props.get("addMethod") or "POST").upper()
    add_action = props.get("addAction")

    # Normalize price (supports 12,99 and 12.99)
    def _to_float(val):
        try:
            return float(str(val).replace(",", "."))
        except Exception:
            return 0.0
    price_val = _to_float(price_raw)
    price_display = f"{price_val:.2f}"
    price_js = str(price_val)

    # Safe values for JS
    safe_name = str(name).replace("'", "\\'")
    safe_image = str(image).replace("'", "\\'")
    safe_id = str(id_).replace("'", "\\'")

    # Build add handler (unchanged below)
    if add_action:
        safe = add_action.replace("\\", "\\\\").replace("'", "\\'")
        add_handler = f" onClick={{() => window.sevdoAct('{safe}')}}"
    else:
        endpoint = add_path or "/api/echo"
        add_handler = (
            " onClick={() => {"
            + f"const key='{cart_key}';"
            + "let cart=[]; try{cart=JSON.parse(localStorage.getItem(key)||'[]')}catch(e){cart=[]}"
            + f"const item={{id:'{safe_id}', name:'{safe_name}', price:Number({price_js}), image:'{safe_image}'}};"
            + "cart.push(item); localStorage.setItem(key, JSON.stringify(cart));"
            + "window.sevdoAct('api:"
            + add_method
            + " "
            + endpoint
            + "|' + JSON.stringify({event:'add_to_cart', item:item, ts: Date.now()}));"
            + "const list=document.getElementById('ac-list'); if(list){"
            + "  const empty=document.getElementById('ac-empty'); if(empty){ try{empty.remove();}catch(_){}}"
            + "  const row=document.createElement('div'); row.className='flex items-center justify-between py-2';"
            + "  const left=document.createElement('div'); left.className='flex items-center gap-3';"
            + "  if(item.image){ const img=document.createElement('img'); img.src=item.image; img.className='w-10 h-10 rounded object-cover'; left.appendChild(img); }"
            + "  const info=document.createElement('div');"
            + "  const nm=document.createElement('div'); nm.className='font-medium'; nm.textContent=item.name; info.appendChild(nm);"
            + f"  const sub=document.createElement('div'); sub.className='text-sm text-gray-500'; sub.textContent='{currency}' + item.price.toFixed(2); info.appendChild(sub);"
            + "  left.appendChild(info);"
            + f"  const right=document.createElement('div'); right.className='text-sm text-gray-700'; right.textContent='{currency}' + item.price.toFixed(2);"
            + "  row.appendChild(left); row.appendChild(right); list.appendChild(row);"
            + "  const cnt=document.getElementById('ac-count'); if(cnt){ cnt.textContent=String(cart.length); }"
            + f"  const totEl=document.getElementById('ac-total'); if(totEl){{ const tot=cart.reduce((s,x)=>s+Number(x.price||0),0); totEl.textContent='{currency}' + tot.toFixed(2); }}"
            + "}"
            + "}}"
        )

    img_html = (
        f'<img src="{image}" alt="{name}" className="w-full h-40 object-cover rounded-t"/>'
        if image else '<div className="w-full h-40 bg-gray-200 rounded-t"></div>'
    )

    return f"""<div className="border rounded-lg overflow-hidden bg-white shadow-sm">
  {img_html}
  <div className="p-4">
    <div className="font-semibold text-gray-900 mb-1">{name}</div>
    <div className="text-gray-700 mb-3">{currency}{price_display}</div>
    <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded text-sm w-full"{add_handler}>
      {button_text}
    </button>
  </div>
</div>"""


# Register with token "pdc"
COMPONENT_TOKEN = "pdc"
