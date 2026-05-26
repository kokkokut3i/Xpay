import { User } from '@supabase/supabase-js';
import { useState } from 'react';
import { supabase } from './supabase';

interface DataPackage {
  id: string;
  gb: number;
  price: number;
  name: string;
}

interface TransferParams {
  method: 'phone' | 'account' | null;
  target: string;
  type: 'money' | 'unit' | 'data';
  value: string | DataPackage;
}

export const useTransfer = (user: User | null) => {
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferError, setTransferError] = useState<string | null>(null);

  const handleTransfer = async ({ method, target, type, value }: TransferParams): Promise<boolean> => {
    if (!user) {
      setTransferError("Хэрэглэгч нэвтрээгүй байна.");
      return false;
    }

    setIsTransferring(true);
    setTransferError(null);

    try {
      if (method !== 'phone') {
        throw new Error("Одоогоор зөвхөн утасны дугаараар шилжүүлэх боломжтой.");
      }

      const { data: result, error } = await supabase.rpc('execute_transfer', {
        sender_id: user.id,
        recipient_phone: target,
        transfer_type: type,
        transfer_value: type === 'data' ? (value as DataPackage).price : parseInt(value as string)
      });

      if (error) throw error;
      if (result !== 'Амжилттай') throw new Error((result as string).replace('Алдаа: ', ''));

      setIsTransferring(false);
      return true;
    } catch (err: any) {
      setTransferError(err.message);
      setIsTransferring(false);
      return false;
    }
  };

  return { isTransferring, transferError, handleTransfer, setTransferError };
};