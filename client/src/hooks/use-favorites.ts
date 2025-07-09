import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const USER_ID = "default-user"; // For demo purposes

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const queryClient = useQueryClient();

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error("Failed to parse favorites from localStorage:", error);
      }
    }
  }, []);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addFavoriteMutation = useMutation({
    mutationFn: async (shortcutId: number) => {
      return apiRequest("POST", "/api/favorites", {
        shortcutId,
        userId: USER_ID,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: async (shortcutId: number) => {
      return apiRequest("DELETE", `/api/favorites/${shortcutId}/${USER_ID}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
    },
  });

  const addFavorite = (shortcutId: number) => {
    if (!favorites.includes(shortcutId)) {
      setFavorites(prev => [...prev, shortcutId]);
      addFavoriteMutation.mutate(shortcutId);
    }
  };

  const removeFavorite = (shortcutId: number) => {
    setFavorites(prev => prev.filter(id => id !== shortcutId));
    removeFavoriteMutation.mutate(shortcutId);
  };

  const isFavorite = (shortcutId: number) => {
    return favorites.includes(shortcutId);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    isAddingFavorite: addFavoriteMutation.isPending,
    isRemovingFavorite: removeFavoriteMutation.isPending,
  };
}
