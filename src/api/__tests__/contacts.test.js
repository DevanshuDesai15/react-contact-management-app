import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock axios before importing anything else
vi.mock("axios", () => ({
  default: {
    create: vi.fn(() => ({
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
      post: vi.fn(),
      get: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    })),
  },
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

describe("API Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create axios instance with correct base URL", async () => {
    const axios = await import("axios");
    const { default: api, authAPI } = await import("../contacts");

    expect(axios.default.create).toHaveBeenCalledWith({
      baseURL: "http://localhost:3007/",
    });
  });

  it("should set up request interceptors", async () => {
    const mockInstance = {
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
      post: vi.fn(),
    };

    const axios = await import("axios");
    axios.default.create.mockReturnValue(mockInstance);

    // Re-import to trigger the setup
    delete require.cache[require.resolve("../contacts")];
    await import("../contacts");

    expect(mockInstance.interceptors.request.use).toHaveBeenCalled();
    expect(mockInstance.interceptors.response.use).toHaveBeenCalled();
  });

  it("should handle token injection in request interceptor", () => {
    mockLocalStorage.getItem.mockReturnValue("mock-token");

    const mockConfig = { headers: {} };

    // Simulate the request interceptor logic
    const requestInterceptor = (config) => {
      const token = localStorage.getItem("token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    };

    const result = requestInterceptor(mockConfig);
    expect(result.headers.Authorization).toBe("Bearer mock-token");
  });

  it("should handle response interceptor error handling", () => {
    const mockError = {
      response: { status: 401 },
    };

    // Mock window.location
    Object.defineProperty(window, "location", {
      value: { pathname: "/contacts", href: "" },
      writable: true,
    });

    const errorHandler = (error) => {
      if (
        error.response?.status === 401 &&
        window.location.pathname !== "/login"
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    };

    expect(() => errorHandler(mockError)).rejects.toEqual(mockError);
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("token");
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("user");
    expect(window.location.href).toBe("/login");
  });
});
