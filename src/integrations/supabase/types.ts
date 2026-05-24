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
      appointments: {
        Row: {
          chair: string | null
          created_at: string
          date: string
          dentist_id: string | null
          id: string
          is_walk_in: boolean | null
          notes: string | null
          patient_id: string
          recurrence_parent_id: string | null
          recurrence_rule: string | null
          status: string
          time: string
          treatment_type: string | null
        }
        Insert: {
          chair?: string | null
          created_at?: string
          date: string
          dentist_id?: string | null
          id?: string
          is_walk_in?: boolean | null
          notes?: string | null
          patient_id: string
          recurrence_parent_id?: string | null
          recurrence_rule?: string | null
          status?: string
          time: string
          treatment_type?: string | null
        }
        Update: {
          chair?: string | null
          created_at?: string
          date?: string
          dentist_id?: string | null
          id?: string
          is_walk_in?: boolean | null
          notes?: string | null
          patient_id?: string
          recurrence_parent_id?: string | null
          recurrence_rule?: string | null
          status?: string
          time?: string
          treatment_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_dentist_id_fkey"
            columns: ["dentist_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_recurrence_parent_fkey"
            columns: ["recurrence_parent_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      clinical_notes: {
        Row: {
          appointment_id: string | null
          assessment: string | null
          created_at: string
          dentist_id: string | null
          id: string
          objective: string | null
          patient_id: string
          plan: string | null
          subjective: string | null
        }
        Insert: {
          appointment_id?: string | null
          assessment?: string | null
          created_at?: string
          dentist_id?: string | null
          id?: string
          objective?: string | null
          patient_id: string
          plan?: string | null
          subjective?: string | null
        }
        Update: {
          appointment_id?: string | null
          assessment?: string | null
          created_at?: string
          dentist_id?: string | null
          id?: string
          objective?: string | null
          patient_id?: string
          plan?: string | null
          subjective?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clinical_notes_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clinical_notes_dentist_id_fkey"
            columns: ["dentist_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clinical_notes_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      consent_forms: {
        Row: {
          created_at: string
          form_content: Json | null
          form_type: string
          id: string
          patient_id: string
          signature_data: string | null
          signed_at: string | null
          witness_name: string | null
        }
        Insert: {
          created_at?: string
          form_content?: Json | null
          form_type?: string
          id?: string
          patient_id: string
          signature_data?: string | null
          signed_at?: string | null
          witness_name?: string | null
        }
        Update: {
          created_at?: string
          form_content?: Json | null
          form_type?: string
          id?: string
          patient_id?: string
          signature_data?: string | null
          signed_at?: string | null
          witness_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consent_forms_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnoses: {
        Row: {
          alcohol: string | null
          created_at: string
          created_by: string | null
          diagnosis_notes: string | null
          eoe_facial_symmetry: string | null
          eoe_jaw_movement: string | null
          eoe_lymph_nodes: string | null
          eoe_notes: string | null
          eoe_swelling: string | null
          eoe_tmj: string | null
          family_history: string | null
          ge_abnormalities: string | null
          ge_appearance: string | null
          ge_vitals_bp: string | null
          ge_vitals_pulse: string | null
          ge_vitals_temp: string | null
          hpc: string | null
          id: string
          investigations_notes: string | null
          io_caries: string | null
          io_gingiva: string | null
          io_mucosa: string | null
          io_notes: string | null
          io_occlusion: string | null
          io_palate: string | null
          io_teeth: string | null
          io_tongue: string | null
          lifestyle_notes: string | null
          occupation: string | null
          past_dental: string | null
          patient_id: string
          pmh_allergies: string | null
          pmh_chronic: string[] | null
          pmh_medications: string | null
          pmh_other: string | null
          pmh_surgeries: string | null
          primary_diagnosis: string | null
          secondary_diagnosis: string | null
          smoking: string | null
          tx_followup_date: string | null
          tx_instructions: string | null
          tx_medications: string | null
          tx_notes: string | null
          tx_procedures: string | null
        }
        Insert: {
          alcohol?: string | null
          created_at?: string
          created_by?: string | null
          diagnosis_notes?: string | null
          eoe_facial_symmetry?: string | null
          eoe_jaw_movement?: string | null
          eoe_lymph_nodes?: string | null
          eoe_notes?: string | null
          eoe_swelling?: string | null
          eoe_tmj?: string | null
          family_history?: string | null
          ge_abnormalities?: string | null
          ge_appearance?: string | null
          ge_vitals_bp?: string | null
          ge_vitals_pulse?: string | null
          ge_vitals_temp?: string | null
          hpc?: string | null
          id?: string
          investigations_notes?: string | null
          io_caries?: string | null
          io_gingiva?: string | null
          io_mucosa?: string | null
          io_notes?: string | null
          io_occlusion?: string | null
          io_palate?: string | null
          io_teeth?: string | null
          io_tongue?: string | null
          lifestyle_notes?: string | null
          occupation?: string | null
          past_dental?: string | null
          patient_id: string
          pmh_allergies?: string | null
          pmh_chronic?: string[] | null
          pmh_medications?: string | null
          pmh_other?: string | null
          pmh_surgeries?: string | null
          primary_diagnosis?: string | null
          secondary_diagnosis?: string | null
          smoking?: string | null
          tx_followup_date?: string | null
          tx_instructions?: string | null
          tx_medications?: string | null
          tx_notes?: string | null
          tx_procedures?: string | null
        }
        Update: {
          alcohol?: string | null
          created_at?: string
          created_by?: string | null
          diagnosis_notes?: string | null
          eoe_facial_symmetry?: string | null
          eoe_jaw_movement?: string | null
          eoe_lymph_nodes?: string | null
          eoe_notes?: string | null
          eoe_swelling?: string | null
          eoe_tmj?: string | null
          family_history?: string | null
          ge_abnormalities?: string | null
          ge_appearance?: string | null
          ge_vitals_bp?: string | null
          ge_vitals_pulse?: string | null
          ge_vitals_temp?: string | null
          hpc?: string | null
          id?: string
          investigations_notes?: string | null
          io_caries?: string | null
          io_gingiva?: string | null
          io_mucosa?: string | null
          io_notes?: string | null
          io_occlusion?: string | null
          io_palate?: string | null
          io_teeth?: string | null
          io_tongue?: string | null
          lifestyle_notes?: string | null
          occupation?: string | null
          past_dental?: string | null
          patient_id?: string
          pmh_allergies?: string | null
          pmh_chronic?: string[] | null
          pmh_medications?: string | null
          pmh_other?: string | null
          pmh_surgeries?: string | null
          primary_diagnosis?: string | null
          secondary_diagnosis?: string | null
          smoking?: string | null
          tx_followup_date?: string | null
          tx_instructions?: string | null
          tx_medications?: string | null
          tx_notes?: string | null
          tx_procedures?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "diagnoses_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          category: string | null
          created_at: string
          file_url: string
          id: string
          name: string
          notes: string | null
          patient_id: string | null
          uploaded_by: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          file_url: string
          id?: string
          name: string
          notes?: string | null
          patient_id?: string | null
          uploaded_by?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          file_url?: string
          id?: string
          name?: string
          notes?: string | null
          patient_id?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          category: string | null
          created_at: string
          created_by: string | null
          date: string
          description: string
          id: string
          notes: string | null
          payment_method: string | null
          receipt_url: string | null
          vendor: string | null
        }
        Insert: {
          amount?: number
          category?: string | null
          created_at?: string
          created_by?: string | null
          date?: string
          description: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          receipt_url?: string | null
          vendor?: string | null
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string
          created_by?: string | null
          date?: string
          description?: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          receipt_url?: string | null
          vendor?: string | null
        }
        Relationships: []
      }
      insurance_claims: {
        Row: {
          amount_approved: number | null
          amount_claimed: number
          claim_number: string | null
          created_at: string
          id: string
          invoice_id: string | null
          notes: string | null
          patient_id: string
          provider_id: string
          resolved_at: string | null
          status: string
          submitted_at: string | null
        }
        Insert: {
          amount_approved?: number | null
          amount_claimed?: number
          claim_number?: string | null
          created_at?: string
          id?: string
          invoice_id?: string | null
          notes?: string | null
          patient_id: string
          provider_id: string
          resolved_at?: string | null
          status?: string
          submitted_at?: string | null
        }
        Update: {
          amount_approved?: number | null
          amount_claimed?: number
          claim_number?: string | null
          created_at?: string
          id?: string
          invoice_id?: string | null
          notes?: string | null
          patient_id?: string
          provider_id?: string
          resolved_at?: string | null
          status?: string
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "insurance_claims_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insurance_claims_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insurance_claims_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "insurance_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_providers: {
        Row: {
          address: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          id: string
          name: string
          notes: string | null
        }
        Insert: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          name: string
          notes?: string | null
        }
        Update: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
        }
        Relationships: []
      }
      inventory: {
        Row: {
          category: string | null
          created_at: string
          id: string
          last_restocked: string | null
          min_stock: number
          name: string
          quantity: number
          supplier: string | null
          unit: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          last_restocked?: string | null
          min_stock?: number
          name: string
          quantity?: number
          supplier?: string | null
          unit?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          last_restocked?: string | null
          min_stock?: number
          name?: string
          quantity?: number
          supplier?: string | null
          unit?: string | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          created_at: string
          discount: number | null
          id: string
          invoice_number: string
          items: Json | null
          patient_id: string
          status: string
          total: number | null
        }
        Insert: {
          created_at?: string
          discount?: number | null
          id?: string
          invoice_number: string
          items?: Json | null
          patient_id: string
          status?: string
          total?: number | null
        }
        Update: {
          created_at?: string
          discount?: number | null
          id?: string
          invoice_number?: string
          items?: Json | null
          patient_id?: string
          status?: string
          total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          attachments: string[] | null
          content: string
          created_at: string
          id: string
          read: boolean | null
          receiver_id: string | null
          sender_id: string | null
        }
        Insert: {
          attachments?: string[] | null
          content: string
          created_at?: string
          id?: string
          read?: boolean | null
          receiver_id?: string | null
          sender_id?: string | null
        }
        Update: {
          attachments?: string[] | null
          content?: string
          created_at?: string
          id?: string
          read?: boolean | null
          receiver_id?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string | null
          read: boolean | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          read?: boolean | null
          title: string
          type?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      patient_images: {
        Row: {
          created_at: string
          id: string
          image_type: string
          image_url: string
          notes: string | null
          patient_id: string
          tooth_number: number | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          image_type?: string
          image_url: string
          notes?: string | null
          patient_id: string
          tooth_number?: number | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          image_type?: string
          image_url?: string
          notes?: string | null
          patient_id?: string
          tooth_number?: number | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_images_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_images_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_insurance: {
        Row: {
          coverage_details: Json | null
          created_at: string
          group_number: string | null
          id: string
          patient_id: string
          policy_number: string | null
          provider_id: string
          relationship: string | null
          subscriber_name: string | null
          valid_from: string | null
          valid_to: string | null
        }
        Insert: {
          coverage_details?: Json | null
          created_at?: string
          group_number?: string | null
          id?: string
          patient_id: string
          policy_number?: string | null
          provider_id: string
          relationship?: string | null
          subscriber_name?: string | null
          valid_from?: string | null
          valid_to?: string | null
        }
        Update: {
          coverage_details?: Json | null
          created_at?: string
          group_number?: string | null
          id?: string
          patient_id?: string
          policy_number?: string | null
          provider_id?: string
          relationship?: string | null
          subscriber_name?: string | null
          valid_from?: string | null
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_insurance_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_insurance_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "insurance_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_reviews: {
        Row: {
          appointment_id: string | null
          comment: string | null
          created_at: string
          id: string
          is_public: boolean | null
          patient_id: string | null
          rating: number
        }
        Insert: {
          appointment_id?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          is_public?: boolean | null
          patient_id?: string | null
          rating: number
        }
        Update: {
          appointment_id?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          is_public?: boolean | null
          patient_id?: string | null
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "patient_reviews_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_reviews_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          address: string | null
          allergies: string[] | null
          blood_group: string | null
          created_at: string
          dob: string | null
          email: string | null
          emergency_contact: Json | null
          gender: string | null
          id: string
          last_visit: string | null
          medical_history: string[] | null
          name: string
          phone: string | null
          referral_source: string | null
          serial_number: string | null
          status: string
        }
        Insert: {
          address?: string | null
          allergies?: string[] | null
          blood_group?: string | null
          created_at?: string
          dob?: string | null
          email?: string | null
          emergency_contact?: Json | null
          gender?: string | null
          id?: string
          last_visit?: string | null
          medical_history?: string[] | null
          name: string
          phone?: string | null
          referral_source?: string | null
          serial_number?: string | null
          status?: string
        }
        Update: {
          address?: string | null
          allergies?: string[] | null
          blood_group?: string | null
          created_at?: string
          dob?: string | null
          email?: string | null
          emergency_contact?: Json | null
          gender?: string | null
          id?: string
          last_visit?: string | null
          medical_history?: string[] | null
          name?: string
          phone?: string | null
          referral_source?: string | null
          serial_number?: string | null
          status?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          date: string
          id: string
          invoice_id: string
          method: string
          notes: string | null
        }
        Insert: {
          amount?: number
          created_at?: string
          date?: string
          id?: string
          invoice_id: string
          method?: string
          notes?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          date?: string
          id?: string
          invoice_id?: string
          method?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      prescriptions: {
        Row: {
          created_at: string
          dentist_id: string | null
          id: string
          medications: Json | null
          notes: string | null
          patient_id: string
        }
        Insert: {
          created_at?: string
          dentist_id?: string | null
          id?: string
          medications?: Json | null
          notes?: string | null
          patient_id: string
        }
        Update: {
          created_at?: string
          dentist_id?: string | null
          id?: string
          medications?: Json | null
          notes?: string | null
          patient_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prescriptions_dentist_id_fkey"
            columns: ["dentist_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescriptions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      staff: {
        Row: {
          avatar: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          role: Database["public"]["Enums"]["app_role"]
          specialty: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          specialty?: string | null
          status?: string
          user_id?: string | null
        }
        Update: {
          avatar?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          specialty?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      tooth_records: {
        Row: {
          created_at: string
          date: string | null
          dentist_id: string | null
          id: string
          notes: string | null
          patient_id: string
          procedure: string | null
          status: string
          tooth_number: number
        }
        Insert: {
          created_at?: string
          date?: string | null
          dentist_id?: string | null
          id?: string
          notes?: string | null
          patient_id: string
          procedure?: string | null
          status?: string
          tooth_number: number
        }
        Update: {
          created_at?: string
          date?: string | null
          dentist_id?: string | null
          id?: string
          notes?: string | null
          patient_id?: string
          procedure?: string | null
          status?: string
          tooth_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "tooth_records_dentist_id_fkey"
            columns: ["dentist_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tooth_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      treatment_plans: {
        Row: {
          created_at: string
          id: string
          patient_id: string
          procedures: Json | null
          total_cost: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          patient_id: string
          procedures?: Json | null
          total_cost?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          patient_id?: string
          procedures?: Json | null
          total_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "treatment_plans_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      treatments: {
        Row: {
          category: string | null
          created_at: string
          duration: number
          id: string
          name: string
          price: number
        }
        Insert: {
          category?: string | null
          created_at?: string
          duration?: number
          id?: string
          name: string
          price?: number
        }
        Update: {
          category?: string | null
          created_at?: string
          duration?: number
          id?: string
          name?: string
          price?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "admin"
        | "dentist"
        | "receptionist"
        | "hygienist"
        | "assistant"
        | "accountant"
        | "nurse"
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
    Enums: {
      app_role: [
        "admin",
        "dentist",
        "receptionist",
        "hygienist",
        "assistant",
        "accountant",
        "nurse",
      ],
    },
  },
} as const
