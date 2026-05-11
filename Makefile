test:
		bundle exec rspec
		cd frontend && npx jest --ci --runInBand

rspec:
		bundle exec rspec

jest:
		cd frontend && npx jest --ci --runInBand
