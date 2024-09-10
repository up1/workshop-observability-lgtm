FROM grafana/grafana:11.2.0
COPY ./prometheus-datasource.yml  /etc/grafana/provisioning/datasources/ 
COPY ./dashboards.yml  /etc/grafana/provisioning/dashboards/
COPY ./dashboards/  /var/lib/grafana/dashboards/
#Disable login of grafana
# ENV GF_AUTH_ANONYMOUS_ENABLED=true