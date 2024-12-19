export interface Database {
  public: {
    Tables: {
      jobs: {
        Row: {
          id: string
          title: string
          client: string
          status: 'active' | 'completed' | 'on-hold'
          created_at: string
          last_modified: string
          due_date: string | null
          project: string | null
          section: string | null
          reference: string | null
          address: string | null
          drawing_number: string | null
          user_id: string
        }
        Insert: Omit<Database['public']['Tables']['jobs']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['jobs']['Insert']>
      }
      documents: {
        Row: {
          id: string
          job_id: string
          name: string
          file_path: string
          created_at: string
          last_modified: string
          user_id: string
        }
        Insert: Omit<Database['public']['Tables']['documents']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['documents']['Insert']>
      }
      annotations: {
        Row: {
          id: string
          document_id: string
          type: 'box' | 'measurement' | 'text'
          position: {
            left: number
            top: number
            width: number
            height: number
            angle: number
          }
          tag_pattern_id: string | null
          extracted_text: string | null
          confidence: number | null
          created_at: string
          last_modified: string
          user_id: string
        }
        Insert: Omit<Database['public']['Tables']['annotations']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['annotations']['Insert']>
      }
      tag_patterns: {
        Row: {
          id: string
          document_id: string
          prefix: string
          description: string
          schedule_table: string
          created_at: string
          user_id: string
        }
        Insert: Omit<Database['public']['Tables']['tag_patterns']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['tag_patterns']['Insert']>
      }
    }
  }
}