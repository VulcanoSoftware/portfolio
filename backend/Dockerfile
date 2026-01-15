FROM python:3.11.3-bullseye

WORKDIR /app

COPY requirements.txt ./
COPY app.py ./
RUN pip install -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "app.py"]