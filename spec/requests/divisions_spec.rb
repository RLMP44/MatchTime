require 'rails_helper'

RSpec.describe "Divisions", type: :request do
  describe "GET /api/division" do
    it "works! (now write some real specs)" do
      get api_division_index_path
      expect(response).to have_http_status(200)
    end
  end

  describe "GET /api/division/:id" do
  end

  describe "POST /api/division" do
  end

  describe "PATCH /api/division/:id" do
  end

  describe "DELETE /api/division/:id" do
  end

  describe "PUT /api/division/clear_existing" do
  end

  describe "PUT /api/division/merge" do
  end
end
