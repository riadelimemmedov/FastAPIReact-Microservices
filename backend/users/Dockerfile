FROM python:3.8-slim

ENV PYTHONUNBUFFERED 1

WORKDIR /users

COPY ./requirements.txt /users/requirements.txt
RUN pip install -r requirements.txt
COPY . /users/