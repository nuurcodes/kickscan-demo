import { supabase } from '@lib/supabase';
import { Table } from '@type/database';
import { Barcode } from '@models/Barcode';

export const getSneaker = async (barcode: string): Promise<Barcode | null> => {
  const { data, error } = await supabase
    .from(Table.BARCODE)
    .select('*, sku:sku (*)')
    .eq('barcode', barcode)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data ?? null;
};
