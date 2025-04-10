# HealthApp - Aplikacja do Monitorowania Zdrowia

Aplikacja full-stack do monitorowania dziennych parametrów zdrowia z autoryzacją JWT.

## Technologie

- **Backend**: C# .NET 9.0, Entity Framework Core, JWT Authentication
- **Frontend**: React 19, Material-UI, Chart.js
- **Baza danych**: SQLite
- **Konteneryzacja**: Docker & Docker Compose

## Uruchomienie z Docker

### Wymagania
- Docker
- Docker Compose

### Szybkie uruchomienie

1. **Sklonuj repozytorium**
```bash
git clone <your-repo-url>
cd CSharp_Learn
```

2. **Uruchom aplikację**
```bash
docker-compose up --build
```

3. **Dostęp do aplikacji**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Swagger API Doc: http://localhost:5000/swagger

### Polecenia Docker

```bash
# Zbuduj i uruchom w tle
docker-compose up -d --build

# Zatrzymaj aplikację
docker-compose down

# Wyświetl logi
docker-compose logs -f

# Zatrzymaj i usuń wszystko (wraz z danymi)
docker-compose down -v
```

## Funkcjonalności

- ✅ Rejestracja i logowanie użytkowników
- ✅ Autoryzacja JWT
- ✅ Zarządzanie profilem użytkownika
- ✅ Tworzenie dziennych raportów zdrowia
- ✅ Wyświetlanie historii raportów
- ✅ Statystyki i wykresy
- ✅ Responsywny UI z Material-UI