{{/*
Expand the name of the chart.
*/}}
{{- define "crontab-plugin.name" -}}
{{- default (default .Chart.Name .Release.Name) .Values.plugin.name | trunc 63 | trimSuffix "-" }}
{{- end }}


{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "crontab-plugin.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "crontab-plugin.labels" -}}
helm.sh/chart: {{ include "crontab-plugin.chart" . }}
{{ include "crontab-plugin.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "crontab-plugin.selectorLabels" -}}
app: {{ include "crontab-plugin.name" . }}
app.kubernetes.io/name: {{ include "crontab-plugin.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/part-of: {{ include "crontab-plugin.name" . }}
{{- end }}

{{/*
Create the name secret containing the certificate
*/}}
{{- define "crontab-plugin.certificateSecret" -}}
{{ default (printf "%s-cert" (include "crontab-plugin.name" .)) .Values.plugin.certificateSecretName }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "crontab-plugin.serviceAccountName" -}}
{{- if .Values.plugin.serviceAccount.create }}
{{- default (include "crontab-plugin.name" .) .Values.plugin.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.plugin.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Create the name of the patcher
*/}}
{{- define "crontab-plugin.patcherName" -}}
{{- printf "%s-patcher" (include "crontab-plugin.name" .) }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "crontab-plugin.patcherServiceAccountName" -}}
{{- if .Values.plugin.patcherServiceAccount.create }}
{{- default (printf "%s-patcher" (include "crontab-plugin.name" .)) .Values.plugin.patcherServiceAccount.name }}
{{- else }}
{{- default "default" .Values.plugin.patcherServiceAccount.name }}
{{- end }}
{{- end }}