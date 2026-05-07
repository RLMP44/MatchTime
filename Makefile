test:
		bundle exec rspec
		cd frontend && npm test -- --ci --runInBand

rspec:
		bundle exec rspec

jest:
		cd frontend && npm test -- --ci --runInBand
