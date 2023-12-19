from django import template

register = template.Library()

@register.filter(name='sub')
def sub(a,b):
    a = float(a)
    b = float(b)
    return a-b

@register.filter(name='sub_int')
def sub_int(a,b):
    if a == '':
        a=0
    if b == '':
        b=0
    a = float(a)
    b = float(b)
    return a-b
    