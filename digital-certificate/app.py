from PIL import Image, ImageDraw, ImageFont
import subprocess
img = Image.open('./original_cert.png')
import sys
from flask import Flask,request

app = Flask(__name__)

@app.route("/", methods=['GET', 'POST'])
def gen_cert():
    fnt_name = ImageFont.truetype('./name_font.ttf', 90)
    fnt_text = ImageFont.truetype('./text_font.ttf', 25)
    
    d = ImageDraw.Draw(img)
    
    name = request.args.get('name')
    account = request.args.get('account')
    
    propertyAddress = request.args.get('propertyAddress')
    
    text_line1 = "This is to certify that A/C "
    text_line2 = "Is the owner of property "
    text_line3 = " under the Govt. Act 1882"
    
    size = d.textsize(name, font=fnt_name)[0]
    
    d.text((1020-size,350), name , font=fnt_name, fill=(0, 0, 0))
    d.text((170,400), '___________________', font=fnt_name , fill=(211, 211, 211))
    
    d.text((1020-755,510), text_line1 , font=fnt_text, fill=(0, 0, 0))
    size = d.textsize(account, font=fnt_text)[0]
    d.text((1020-size,510), account , font=fnt_text, fill=(255, 0, 0))
    
    d.text((1020-848,545), text_line2 , font=fnt_text, fill=(0, 0, 0))
    size = d.textsize(propertyAddress[:53], font=fnt_text)[0]
    d.text((1020-size,545), propertyAddress[:53] , font=fnt_text, fill=(255, 0, 0))
    
    size = d.textsize(propertyAddress[53:], font=fnt_text)[0]
    d.text((1020-848,580), propertyAddress[53:] , font=fnt_text, fill=(255, 0, 0))
    d.text((1020-848+size,580), text_line3 , font=fnt_text, fill=(0, 0, 0))
    im='{0}_{1}.png'.format(account,propertyAddress)
    img.save('./certificates/'+im)
    return 'OK'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)
