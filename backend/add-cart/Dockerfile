FROM python:3.8-slim

ENV PYTHONUNBUFFERED 1

WORKDIR /add-cart

COPY ./requirements.txt /add-cart/requirements.txt
RUN pip install -r requirements.txt
COPY . /add-cart/