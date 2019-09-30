FROM python:3.6-alpine

WORKDIR /app

COPY . /app/

RUN pip install flask
RUN pip install pillow

EXPOSE 80

CMD ["python", "app.py"]
