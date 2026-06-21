// Shared TanStack Query options used by both the public site and the admin dashboard.
import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const profileQuery = queryOptions({
  queryKey: ["profile"],
  queryFn: async () => {
    const { data, error } = await supabase.from("profile").select("*").limit(1).maybeSingle();
    if (error) throw error;
    return data;
  },
});

export const personalDetailsQuery = queryOptions({
  queryKey: ["personal_details"],
  queryFn: async () => {
    const { data, error } = await supabase.from("personal_details").select("*").limit(1).maybeSingle();
    if (error) throw error;
    return data;
  },
});

export const timelineQuery = queryOptions({
  queryKey: ["timeline"],
  queryFn: async () => {
    const { data, error } = await supabase.from("timeline").select("*").order("sort_order");
    if (error) throw error;
    return data ?? [];
  },
});

export const galleryQuery = queryOptions({
  queryKey: ["gallery"],
  queryFn: async () => {
    const { data, error } = await supabase.from("gallery").select("*").order("sort_order");
    if (error) throw error;
    return data ?? [];
  },
});

export const hobbiesQuery = queryOptions({
  queryKey: ["hobbies"],
  queryFn: async () => {
    const { data, error } = await supabase.from("hobbies").select("*").order("sort_order");
    if (error) throw error;
    return data ?? [];
  },
});
