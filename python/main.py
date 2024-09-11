# main.py
from fastapi import FastAPI
from opentelemetry import trace
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor

# Initialize FastAPI with port 8000
app = FastAPI()
app.port = 8000

# Initialize OpenTelemetry Tracer
tracer = trace.get_tracer(__name__)

# Instrument FastAPI with OpenTelemetry
FastAPIInstrumentor.instrument_app(app)

@app.get("/hello")
async def hello():
    # Create a span for tracing
    with tracer.start_as_current_span("hello_endpoint"):
        return {"message": "Hello fastapi"}