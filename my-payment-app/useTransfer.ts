import { User } from '@supabase/supabase-js';
import { Dispatch, SetStateAction, useState } from 'react';
import { supabase } from './supabase';

interface TransferParams {
  method: 'phone' | 'account' | null;
  target: string;
  type: 'money' | 'unit';
  value: string;
}

export const useTransfer = (
  user: User | null,
  mainBalance: number,
  setMainBalance: Dispatch<SetStateAction<number>>
) => {
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
        transfer_value: parseInt(value as string)
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