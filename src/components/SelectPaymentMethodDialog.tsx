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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
            onClick={() => onSelect("YOUKASSA")}
          >
            <div className="flex items-center gap-3">
              <CreditCard/>
              <span>{t("payments.card")}</span>
            </div>
          </Card>
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
