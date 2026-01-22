import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CreditCard, Star } from "lucide-react";
import { PaymentMethod } from "@/types";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (method: PaymentMethod) => void;
}

export function SelectPaymentMethodDialog({
                                            open,
                                            onOpenChange,
                                            onSelect,
                                          }: Props) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{t("payments.select_method")}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3 mt-4">
          <Card
            className="p-3 cursor-pointer hover:bg-muted transition"
            onClick={() => onSelect("STARS")}
          >
            <div className="flex items-center gap-3">
              <Star/>
              <span>{t("payments.stars")}</span>
            </div>
          </Card>

          <Card
            className="p-3 cursor-pointer hover:bg-muted transition"
            onClick={() => onSelect("ROBOKASSA")}
          >
            <div className="flex items-center gap-3">
              <CreditCard/>
              <span>{t("payments.card")}</span>
            </div>
          </Card>
        </div>
        <div className="flex justify-end">
          <a
            href="/oferta.docx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Публичная оферта
          </a>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
