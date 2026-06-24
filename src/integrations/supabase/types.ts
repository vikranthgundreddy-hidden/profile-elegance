export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bride_photos: {
        Row: {
          created_at: string
          id: string
          name: string
          note: string | null
          photo_url: string
          storage_path: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          note?: string | null
          photo_url: string
          storage_path?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          note?: string | null
          photo_url?: string
          storage_path?: string | null
        }
        Relationships: []
      }
      gallery: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          image_url: string
          sort_order: number
          storage_path: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          image_url: string
          sort_order?: number
          storage_path?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          image_url?: string
          sort_order?: number
          storage_path?: string | null
        }
        Relationships: []
      }
      hobbies: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      meeting_requests: {
        Row: {
          contact: string
          created_at: string
          id: string
          location: string | null
          name: string
          notes: string | null
          timings: string | null
        }
        Insert: {
          contact: string
          created_at?: string
          id?: string
          location?: string | null
          name: string
          notes?: string | null
          timings?: string | null
        }
        Update: {
          contact?: string
          created_at?: string
          id?: string
          location?: string | null
          name?: string
          notes?: string | null
          timings?: string | null
        }
        Relationships: []
      }
      personal_details: {
        Row: {
          age: string | null
          annual_salary: string | null
          blood_group: string | null
          caste: string | null
          college: string | null
          created_at: string
          current_city: string | null
          current_position: string | null
          date_of_birth: string | null
          drinking: string | null
          education: string | null
          experience: string | null
          food_preference: string | null
          full_name: string | null
          future_goals: string | null
          height: string | null
          id: string
          marital_status: string | null
          mother_tongue: string | null
          native_place: string | null
          occupation: string | null
          organization: string | null
          religion: string | null
          smoking: string | null
          updated_at: string
          weight: string | null
          work_location: string | null
        }
        Insert: {
          age?: string | null
          annual_salary?: string | null
          blood_group?: string | null
          caste?: string | null
          college?: string | null
          created_at?: string
          current_city?: string | null
          current_position?: string | null
          date_of_birth?: string | null
          drinking?: string | null
          education?: string | null
          experience?: string | null
          food_preference?: string | null
          full_name?: string | null
          future_goals?: string | null
          height?: string | null
          id?: string
          marital_status?: string | null
          mother_tongue?: string | null
          native_place?: string | null
          occupation?: string | null
          organization?: string | null
          religion?: string | null
          smoking?: string | null
          updated_at?: string
          weight?: string | null
          work_location?: string | null
        }
        Update: {
          age?: string | null
          annual_salary?: string | null
          blood_group?: string | null
          caste?: string | null
          college?: string | null
          created_at?: string
          current_city?: string | null
          current_position?: string | null
          date_of_birth?: string | null
          drinking?: string | null
          education?: string | null
          experience?: string | null
          food_preference?: string | null
          full_name?: string | null
          future_goals?: string | null
          height?: string | null
          id?: string
          marital_status?: string | null
          mother_tongue?: string | null
          native_place?: string | null
          occupation?: string | null
          organization?: string | null
          religion?: string | null
          smoking?: string | null
          updated_at?: string
          weight?: string | null
          work_location?: string | null
        }
        Relationships: []
      }
      private_details: {
        Row: {
          additional_info: string | null
          assets_information: string | null
          created_at: string
          family_info: string | null
          future_plans: string | null
          id: string
          salary_details: string | null
          sensitive_details: string | null
          updated_at: string
        }
        Insert: {
          additional_info?: string | null
          assets_information?: string | null
          created_at?: string
          family_info?: string | null
          future_plans?: string | null
          id?: string
          salary_details?: string | null
          sensitive_details?: string | null
          updated_at?: string
        }
        Update: {
          additional_info?: string | null
          assets_information?: string | null
          created_at?: string
          family_info?: string | null
          future_plans?: string | null
          id?: string
          salary_details?: string | null
          sensitive_details?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profile: {
        Row: {
          about_intro: string | null
          career_journey: string | null
          created_at: string
          current_position: string | null
          education: string | null
          email: string | null
          experience: string | null
          family_overview: string | null
          hero_image_url: string | null
          id: string
          instagram: string | null
          intro: string
          life_goals: string | null
          linkedin: string | null
          location: string | null
          marriage_expectations: string | null
          name: string
          personal_values: string | null
          phone: string | null
          professional_summary: string
          tagline: string
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          about_intro?: string | null
          career_journey?: string | null
          created_at?: string
          current_position?: string | null
          education?: string | null
          email?: string | null
          experience?: string | null
          family_overview?: string | null
          hero_image_url?: string | null
          id?: string
          instagram?: string | null
          intro?: string
          life_goals?: string | null
          linkedin?: string | null
          location?: string | null
          marriage_expectations?: string | null
          name?: string
          personal_values?: string | null
          phone?: string | null
          professional_summary?: string
          tagline?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          about_intro?: string | null
          career_journey?: string | null
          created_at?: string
          current_position?: string | null
          education?: string | null
          email?: string | null
          experience?: string | null
          family_overview?: string | null
          hero_image_url?: string | null
          id?: string
          instagram?: string | null
          intro?: string
          life_goals?: string | null
          linkedin?: string | null
          location?: string | null
          marriage_expectations?: string | null
          name?: string
          personal_values?: string | null
          phone?: string | null
          professional_summary?: string
          tagline?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      queries: {
        Row: {
          contact: string
          created_at: string
          id: string
          message: string
          name: string
        }
        Insert: {
          contact: string
          created_at?: string
          id?: string
          message: string
          name: string
        }
        Update: {
          contact?: string
          created_at?: string
          id?: string
          message?: string
          name?: string
        }
        Relationships: []
      }
      timeline: {
        Row: {
          created_at: string
          description: string | null
          id: string
          sort_order: number
          subtitle: string | null
          title: string
          year: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          sort_order?: number
          subtitle?: string | null
          title: string
          year: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          sort_order?: number
          subtitle?: string | null
          title?: string
          year?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
