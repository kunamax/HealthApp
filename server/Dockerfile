FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build-env
WORKDIR /app

COPY *.csproj ./
RUN dotnet restore

COPY . ./
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build-env /app/out .

RUN mkdir -p /app/data

ENV ASPNETCORE_ENVIRONMENT=Production
ENV DATABASE_PATH=/app/data/health.db

EXPOSE 5000

ENTRYPOINT ["dotnet", "health.dll"]
