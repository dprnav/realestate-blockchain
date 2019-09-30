FROM python

WORKDIR /app

COPY . /app/

RUN pip install flask
RUN pip install pillow

EXPOSE 80

CMD ["python", "app.py"]
