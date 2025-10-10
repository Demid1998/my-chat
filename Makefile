# Makefile для AI Chat Application

.PHONY: help build dev prod stop restart logs status clean

# Цвета для вывода
GREEN=\033[0;32m
YELLOW=\033[1;33m
NC=\033[0m # No Color

# Переменные
COMPOSE_FILE_DEV=docker-compose.yml
COMPOSE_FILE_PROD=docker-compose.prod.yml

help: ## Показать справку
	@echo "$(GREEN)AI Chat Application - Доступные команды:$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2}'

build: ## Собрать все Docker образы
	@echo "$(GREEN)Сборка Docker образов...$(NC)"
	./scripts/build.sh all

build-dev: ## Собрать образы для разработки
	@echo "$(GREEN)Сборка образов для разработки...$(NC)"
	./scripts/build.sh dev

build-prod: ## Собрать образы для продакшна
	@echo "$(GREEN)Сборка образов для продакшна...$(NC)"
	./scripts/build.sh prod

dev: ## Запустить в режиме разработки
	@echo "$(GREEN)Запуск в режиме разработки...$(NC)"
	./scripts/dev.sh

prod: ## Запустить в режиме продакшна
	@echo "$(GREEN)Запуск в режиме продакшна...$(NC)"
	./scripts/deploy.sh prod

stop: ## Остановить все контейнеры
	@echo "$(GREEN)Остановка контейнеров...$(NC)"
	./scripts/deploy.sh stop

restart: ## Перезапустить в режиме разработки
	@echo "$(GREEN)Перезапуск в режиме разработки...$(NC)"
	./scripts/deploy.sh restart

logs: ## Показать логи всех сервисов
	@echo "$(GREEN)Логи сервисов:$(NC)"
	./scripts/deploy.sh logs

logs-server: ## Показать логи сервера
	@echo "$(GREEN)Логи сервера:$(NC)"
	./scripts/deploy.sh logs server

logs-client: ## Показать логи клиента
	@echo "$(GREEN)Логи клиента:$(NC)"
	./scripts/deploy.sh logs client

status: ## Показать статус контейнеров
	@echo "$(GREEN)Статус контейнеров:$(NC)"
	./scripts/deploy.sh status

clean: ## Очистить неиспользуемые образы
	@echo "$(GREEN)Очистка неиспользуемых образов...$(NC)"
	./scripts/deploy.sh cleanup

rollback: ## Откатить изменения
	@echo "$(GREEN)Откат изменений...$(NC)"
	./scripts/deploy.sh rollback

# Команды для разработки
install: ## Установить зависимости локально
	@echo "$(GREEN)Установка зависимостей...$(NC)"
	cd client && npm install
	cd server && npm install

start-local: ## Запустить локально (без Docker)
	@echo "$(GREEN)Запуск локально...$(NC)"
	@echo "Сервер: cd server && npm start"
	@echo "Клиент: cd client && npm start"

# Команды для продакшна
ssl-setup: ## Настроить SSL сертификаты
	@echo "$(GREEN)Настройка SSL сертификатов...$(NC)"
	@mkdir -p nginx/ssl
	@if [ ! -f "nginx/ssl/cert.pem" ] || [ ! -f "nginx/ssl/key.pem" ]; then \
		echo "Создание самоподписанного сертификата..."; \
		openssl req -x509 -newkey rsa:4096 -keyout nginx/ssl/key.pem -out nginx/ssl/cert.pem -days 365 -nodes -subj "/C=RU/ST=State/L=City/O=Organization/CN=localhost"; \
		echo "$(GREEN)SSL сертификаты созданы$(NC)"; \
	else \
		echo "$(YELLOW)SSL сертификаты уже существуют$(NC)"; \
	fi

env-setup: ## Настроить переменные окружения
	@echo "$(GREEN)Настройка переменных окружения...$(NC)"
	@if [ ! -f "server/.env" ]; then \
		cp server/env.example server/.env; \
		echo "$(GREEN)Файл server/.env создан$(NC)"; \
		echo "$(YELLOW)Не забудьте заполнить API ключи!$(NC)"; \
	else \
		echo "$(YELLOW)Файл server/.env уже существует$(NC)"; \
	fi
	@if [ ! -f "server/.env.prod" ]; then \
		cp server/env.prod.example server/.env.prod; \
		echo "$(GREEN)Файл server/.env.prod создан$(NC)"; \
		echo "$(YELLOW)Не забудьте заполнить API ключи для продакшна!$(NC)"; \
	else \
		echo "$(YELLOW)Файл server/.env.prod уже существует$(NC)"; \
	fi

# Команды для мониторинга
health: ## Проверить состояние сервисов
	@echo "$(GREEN)Проверка состояния сервисов:$(NC)"
	@curl -s http://localhost:3001/health && echo " ✅ Сервер работает" || echo " ❌ Сервер недоступен"
	@curl -s http://localhost:3000 > /dev/null && echo " ✅ Клиент работает" || echo " ❌ Клиент недоступен"

# Команды для отладки
debug: ## Показать отладочную информацию
	@echo "$(GREEN)Отладочная информация:$(NC)"
	@echo "Docker версия: $$(docker --version)"
	@echo "Docker Compose версия: $$(docker-compose --version)"
	@echo ""
	@echo "Docker образы:"
	@docker images | grep my-chat || echo "Образы my-chat не найдены"
	@echo ""
	@echo "Docker контейнеры:"
	@docker ps -a | grep my-chat || echo "Контейнеры my-chat не найдены"
