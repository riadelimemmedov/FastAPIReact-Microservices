FROM python:3.8-slim

ENV PYTHONUNBUFFERED 1

WORKDIR /payment

COPY ./requirements.txt /payment/requirements.txt
RUN pip install -r requirements.txt
COPY . /payment/