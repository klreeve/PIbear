from flask import render_template, request

def page_not_found(error):
    return render_template(
        "page_not_found.html",
        high_contrast=request.cookies.get("highContrast") == "true"
        ), 404