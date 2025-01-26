export interface Recipe {
  id: string;
  title: string;
  category: 'agar' | 'liquid-culture' | 'substrate' | 'other';
  ingredients: string[];
  steps: string[];
  notes?: string;
  createdAt: Date;
  isCustom: boolean;
  status: 'pending' | 'approved' | 'rejected';
  submittedBy?: string;
}

export interface RecipeFormData {
  title: string;
  category: Recipe['category'];
  ingredients: string[];
  steps: string[];
  notes?: string;
  submittedBy: string;
}

export interface AdminState {
  isAdmin: boolean;
  password: string;
}