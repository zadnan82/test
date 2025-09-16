# sevdo_frontend/prefabs/add_to_cart.py
def render_prefab(args, props):
    # Defaults
    title = props.get("title", "Your Cart")
    empty_text = props.get("emptyText", "Your cart is empty.")
    checkout_text = props.get("checkoutText", "Checkout")
    clear_text = props.get("clearText", "Clear")
    currency = props.get("currency", "$")
    cart_key = props.get("cartKey", "sevdoCart")

    # Optional backend props
    checkout_path = props.get("checkoutPath")
    checkout_method = (props.get("checkoutMethod") or "POST").upper()
    checkout_action = props.get("checkoutAction")

    # Nested overrides
    if args:
        import sys
        import os
        parent_dir = os.path.dirname(
            os.path.dirname(os.path.abspath(__file__)))
        if parent_dir not in sys.path:
            sys.path.append(parent_dir)
        from frontend_compiler import parse_dsl
        try:
            nodes = parse_dsl(args)
            if nodes:
                for node in nodes:
                    if node.token == "h" and node.args:
                        title = node.args
                    elif node.token == "b" and node.args:
                        checkout_text = node.args
        except Exception:
            title = args

    # Clear handler (reset list, count, total and echo)
    clear_handler = (
        " onClick={() => {"
        + f"const key='{cart_key}';"
        + "localStorage.setItem(key,'[]');"
        + "const list=document.getElementById('ac-list');"
        + "if(list){"
        + "  list.innerHTML='';"
        + "  const empty=document.createElement('div');"
        + "  empty.id='ac-empty'; empty.className='text-gray-400 italic py-4';"
        + f"  empty.textContent='{empty_text}';"
        + "  list.appendChild(empty);"
        + "}"
        + "const cnt=document.getElementById('ac-count'); if(cnt){cnt.textContent='0';}"
        + f"const totEl=document.getElementById('ac-total'); if(totEl){{ totEl.textContent='{currency}0.00'; }}"
        + "window.sevdoAct('api:POST /api/echo|' + JSON.stringify({event:'cart_clear', ts: Date.now()}));"
        + "}}"
    )

    # Checkout handler (echo cart content)
    if checkout_action:
        safe = checkout_action.replace("\\", "\\\\").replace("'", "\\'")
        checkout_handler = f" onClick={{() => window.sevdoAct('{safe}')}}"
    else:
        endpoint = checkout_path or "/api/echo"
        checkout_handler = (
            " onClick={() => {"
            + f"const key='{cart_key}'; let cart=[]; try{{cart=JSON.parse(localStorage.getItem(key)||'[]')}}catch(e){{cart=[]}}"
            + "window.sevdoAct('api:"
            + checkout_method
            + " "
            + endpoint
            + "|' + JSON.stringify({event:'checkout', cart:cart, ts: Date.now()}));"
            + "}}"
        )

    # Init: hydrate from localStorage on render
    init_handler = (
        " onLoad={() => {"
        + f"const key='{cart_key}'; let cart=[]; try{{cart=JSON.parse(localStorage.getItem(key)||'[]')}}catch(e){{cart=[]}}"
        + "const list=document.getElementById('ac-list'); if(!list) return;"
        + "const cnt=document.getElementById('ac-count'); const totEl=document.getElementById('ac-total');"
        + "list.innerHTML=''; let tot=0;"
        + f"if(cart.length===0){{ const empty=document.createElement('div'); empty.id='ac-empty'; empty.className='text-gray-400 italic py-4'; empty.textContent='{empty_text}'; list.appendChild(empty); }}"
        + "else { for (const item of cart){ tot+=Number(item.price||0);"
        + "  const row=document.createElement('div'); row.className='flex items-center justify-between py-2';"
        + "  const left=document.createElement('div'); left.className='flex items-center gap-3';"
        + "  if(item.image){ const img=document.createElement('img'); img.src=item.image; img.className='w-10 h-10 rounded object-cover'; left.appendChild(img); }"
        + "  const info=document.createElement('div');"
        + "  const nm=document.createElement('div'); nm.className='font-medium'; nm.textContent=String(item.name||''); info.appendChild(nm);"
        + f"  const sub=document.createElement('div'); sub.className='text-sm text-gray-500'; sub.textContent='{currency}' + Number(item.price||0).toFixed(2); info.appendChild(sub);"
        + "  left.appendChild(info);"
        + f"  const right=document.createElement('div'); right.className='text-sm text-gray-700'; right.textContent='{currency}' + Number(item.price||0).toFixed(2);"
        + "  row.appendChild(left); row.appendChild(right); list.appendChild(row); }}"
        + "if(cnt){ cnt.textContent=String(cart.length); }"
        + f"if(totEl){{ totEl.textContent='{currency}' + Number(tot).toFixed(2); }}"
        + "}}"
    )

    return f"""<section className="py-6 bg-white border rounded-lg">
  <div className="max-w-3xl mx-auto px-4">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold text-gray-900">{title} <span className="ml-2 text-sm text-gray-500">(Items: <span id="ac-count">0</span>)</span></h2>
      <div className="flex gap-2">
        <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-3 py-1.5 rounded text-sm"{clear_handler}>
          {clear_text}
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-1.5 rounded text-sm"{checkout_handler}>
          {checkout_text}
        </button>
      </div>
    </div>
    <div className="mb-3 text-right text-gray-700">Total: <strong id="ac-total">{currency}0.00</strong></div>
    <div id="ac-list" className="divide-y divide-gray-200">
      <div id="ac-empty" className="text-gray-400 italic py-4">{empty_text}</div>
    </div>
    <img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" className="hidden"{init_handler} />
  </div>
</section>"""


# Register with token "ac"
COMPONENT_TOKEN = "ac"
