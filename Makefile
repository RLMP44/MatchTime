test:
		bundle exec rspec
		cd frontend && npm test -- --ci --runInBand
		cd frontend && npx playwright test

rspec:
		bundle exec rspec

jest:
		cd frontend && npm test -- --ci --runInBand

# playwright:
# 		cd frontend && npx playwright test
