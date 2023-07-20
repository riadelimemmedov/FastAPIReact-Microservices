FROM python:3.8-slim

ENV PYTHONUNBUFFERED 1

WORKDIR /inventory

COPY ./requirements.txt /inventory/requirements.txt
RUN pip install -r requirements.txt
COPY . /inventory/