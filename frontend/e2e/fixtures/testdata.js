import { test as base, expect, request as playwrightRequest } from '@playwright/test';

export const test = base.extend({
  testData: async ({}, use) => {
    const rails = await playwrightRequest.newContext({
      baseURL: 'http://localhost:3001/test_support',
      extraHTTPHeaders: { Accept: 'application/json' }
    });

    const api = {
      async createRacer(attrs = {}) {
        const response = await rails.post('/test_support/racer', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          data: { racer: attrs }
        });
        if (!response.ok()) {
          throw new Error(`Failed to create racer: ${response.status()} ${await response.text()}`);
        }
        return await response.json();
      },

      async editRacer(id, attrs = {}) {
        const response = await rails.patch(`/test_support/racer/${id}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          data: { racer: attrs }
        });
        if (!response.ok()) {
          throw new Error(`Failed to edit racer: ${response.status()} ${await response.text()}`);
        }
        return await response.json();
      },

      async deleteRacer(id) {
        await rails.delete(`/test_support/racer/${id}`);
      },

      async deleteAllRacers() {
        await rails.delete('/test_support/racer');
      },

      async createCategory(attrs = {}) {
        const response = await rails.post('/test_support/category', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          data: { category: attrs }
        });
        if (!response.ok()) {
          throw new Error(`Failed to create category: ${response.status()} ${await response.text()}`);
        }
        return await response.json();
      },

      async editCategory(id, attrs = {}) {
        const response = await rails.patch(`/test_support/category/${id}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          data: { category: attrs }
        });
        if (!response.ok()) {
          throw new Error(`Failed to edit category: ${response.status()} ${await response.text()}`);
        }
        return await response.json();
      },

      async deleteCategory(id) {
        await rails.delete(`/test_support/category/${id}`);
      },

      async deleteAllCategories() {
        await rails.delete('/test_support/category/destroy_all');
      },

      async fetchAllCategories() {
        const res = await rails.get('/test_support/category');
        return await res.json();
      },

      async createDivision(attrs = {}) {
        const response = await rails.post('/test_support/division', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          data: { division: attrs }
        });
        if (!response.ok()) {
          throw new Error(`Failed to create division: ${response.status()} ${await response.text()}`);
        }
        return await response.json();
      },

      async editDivision(id, attrs = {}) {
        const response = await rails.patch(`/test_support/division/${id}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          data: { division: attrs }
        });
        if (!response.ok()) {
          throw new Error(`Failed to edit division: ${response.status()} ${await response.text()}`);
        }
        return await response.json();
      },

      async deleteDivision(id) {
        await rails.delete(`/test_support/division/${id}`);
      },

      async deleteAllDivisions() {
        await rails.delete('/test_support/division');
      }
    };

    await use(api);
  }
});

export { expect };
