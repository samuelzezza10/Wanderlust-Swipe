import { useState } from "react";
import { useLocation } from "wouter";
import { useSavePreferences } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Plane, Users, Wallet, Check } from "lucide-react";

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const savePreferences = useSavePreferences();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    budget: 1000,
    numberOfPeople: 1,
    departureLocation: "New York",
    flightPreference: "any",
  });

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      savePreferences.mutate(
        {
          data: {
            defaultBudget: formData.budget,
            defaultNumberOfPeople: formData.numberOfPeople,
            defaultDepartureLocation: formData.departureLocation,
            defaultFlightPreference: formData.flightPreference,
            onboardingCompleted: true,
          },
        },
        {
          onSuccess: () => {
            setLocation("/discover");
          },
        }
      );
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-card p-8 rounded-2xl shadow-sm border">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {step === 1 && "What's your budget?"}
          {step === 2 && "Who's traveling?"}
          {step === 3 && "Flight preferences"}
        </h2>

        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Total budget (USD)</Label>
              <Input
                type="number"
                value={formData.budget}
                onChange={(e) =>
                  setFormData({ ...formData, budget: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Departure City</Label>
              <Input
                value={formData.departureLocation}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    departureLocation: e.target.value,
                  })
                }
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Number of People</Label>
              <Input
                type="number"
                min={1}
                value={formData.numberOfPeople}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    numberOfPeople: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Flight Type</Label>
              <RadioGroup
                value={formData.flightPreference}
                onValueChange={(val) =>
                  setFormData({ ...formData, flightPreference: val })
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="direct" id="direct" />
                  <Label htmlFor="direct">Direct only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="with_stops" id="stops" />
                  <Label htmlFor="stops">With stops</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="any" id="any" />
                  <Label htmlFor="any">Any</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between">
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
          >
            Back
          </Button>
          <Button onClick={handleNext} disabled={savePreferences.isPending}>
            {step === 3 ? "Complete" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
