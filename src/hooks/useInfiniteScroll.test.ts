import { renderHook } from '@testing-library/react';
import { useInfiniteScroll } from './useInfiniteScroll';

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

describe('useInfiniteScroll', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create an IntersectionObserver', () => {
    const onLoadMore = jest.fn();
    
    renderHook(() => useInfiniteScroll({
      onLoadMore,
      hasMore: true,
      loading: false,
    }));

    expect(mockIntersectionObserver).toHaveBeenCalled();
  });

  it('should not call onLoadMore when loading', () => {
    const onLoadMore = jest.fn();
    
    renderHook(() => useInfiniteScroll({
      onLoadMore,
      hasMore: true,
      loading: true,
    }));

    // Simulate intersection
    const observerCallback = mockIntersectionObserver.mock.calls[0][0];
    observerCallback([{ isIntersecting: true }]);

    expect(onLoadMore).not.toHaveBeenCalled();
  });

  it('should not call onLoadMore when hasMore is false', () => {
    const onLoadMore = jest.fn();
    
    renderHook(() => useInfiniteScroll({
      onLoadMore,
      hasMore: false,
      loading: false,
    }));

    // Simulate intersection
    const observerCallback = mockIntersectionObserver.mock.calls[0][0];
    observerCallback([{ isIntersecting: true }]);

    expect(onLoadMore).not.toHaveBeenCalled();
  });

  it('should call onLoadMore when conditions are met', () => {
    const onLoadMore = jest.fn();
    
    renderHook(() => useInfiniteScroll({
      onLoadMore,
      hasMore: true,
      loading: false,
    }));

    // Simulate intersection
    const observerCallback = mockIntersectionObserver.mock.calls[0][0];
    observerCallback([{ isIntersecting: true }]);

    expect(onLoadMore).toHaveBeenCalled();
  });
});