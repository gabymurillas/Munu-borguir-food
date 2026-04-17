export class AdminDataService {
    constructor() {
        const { createClient } = supabase;
        this.client = createClient(supabaseConfig.url, supabaseConfig.anonKey);
    }

    async getCategories() {
        const { data, error } = await this.client.from('categories').select('*').order('id');
        if (error) throw error;
        return data;
    }

    async getProducts() {
        const { data, error } = await this.client.from('products').select('*, prices(*)');
        if (error) throw error;
        return data;
    }

    async updateProductField(id, field, value) {
        const { error } = await this.client.from('products').update({ [field]: value }).eq('id', id);
        if (error) throw error;
    }

    async deleteProduct(id) {
        const { error } = await this.client.from('products').delete().eq('id', id);
        if (error) throw error;
    }

    async updatePrice(id, amount) {
        const { error } = await this.client.from('prices').update({ amount }).eq('id', id);
        if (error) throw error;
    }

    async createProduct(name, category_id, description) {
        const { data, error } = await this.client.from('products')
            .insert([{ name, category_id, description }])
            .select()
            .single();
        if (error) throw error;
        return data;
    }

    async createCategory(name, slug) {
        const { data, error } = await this.client.from('categories')
            .insert([{ name, slug }])
            .select()
            .single();
        if (error) throw error;
        return data;
    }

    async createPrice(product_id, label, amount) {
        const { data, error } = await this.client.from('prices')
            .insert([{ product_id, label, amount }])
            .select()
            .single();
        if (error) throw error;
        return data;
    }
}
