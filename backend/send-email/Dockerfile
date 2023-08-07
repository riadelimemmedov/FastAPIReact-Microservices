FROM python:3.8-slim

ENV PYTHONUNBUFFERED 1

WORKDIR /send-email

COPY ./requirements.txt /send-email/requirements.txt
RUN pip install -r requirements.txt
COPY . /send-email/