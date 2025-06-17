"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calculator, Github } from "lucide-react"
import { LanguageProvider } from "../contexts/language-context"
import { LanguageSwitcher } from "../components/language-switcher"
import { useLanguage } from "../contexts/language-context"
import { IWPCCalculator } from "../components/models/iwpc-calculator"
import { GageCalculator } from "../components/models/gage-calculator"
import { XiangyaCalculator } from "../components/models/xiangya-calculator"
import { BissCalculator } from "../components/models/biss-calculator"
import { CloverCalculator } from "../components/models/clover-calculator"

type ModelType = "iwpc" | "gage" | "xiangya" | "biss" | "clover"

const models = [
  {
    id: "iwpc" as ModelType,
    status: "available",
  },
  {
    id: "gage" as ModelType,
    status: "available",
  },
  {
    id: "xiangya" as ModelType,
    status: "available",
  },
  {
    id: "biss" as ModelType,
    status: "available",
  },
  {
    id: "clover" as ModelType,
    status: "available",
  },
]

function MainContent() {
  const { t } = useLanguage()
  const [selectedModel, setSelectedModel] = useState<ModelType>("iwpc")

  const renderCalculator = () => {
    switch (selectedModel) {
      case "iwpc":
        return <IWPCCalculator />
      case "gage":
        return <GageCalculator />
      case "xiangya":
        return <XiangyaCalculator />
      case "biss":
        return <BissCalculator />
      case "clover":
        return <CloverCalculator />
      default:
        return <IWPCCalculator />
    }
  }

  const handleModelChange = (value: ModelType) => {
    setSelectedModel(value)
  }

  const handleGithubClick = () => {
    // 这里可以替换为实际的GitHub仓库链接
    window.open("https://github.com/pzweuj/Warfarin-Dosage-Calculator", "_blank")
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header with title, model selector, language switcher and GitHub button */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-2">
            <Calculator className="w-8 h-8" />
            <h1 className="text-2xl md:text-3xl font-bold">{t("title")}</h1>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <Label htmlFor="model-select" className="text-sm font-medium whitespace-nowrap">
              {t("selectModel")}:
            </Label>
            <Select value={selectedModel} onValueChange={handleModelChange}>
              <SelectTrigger id="model-select" className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.id} value={model.id} disabled={model.status !== "available"}>
                    <div className="flex items-center justify-between w-full">
                      <span>{t("models." + model.id)}</span>
                      {model.status !== "available" && (
                        <span className="text-xs text-muted-foreground ml-2">
                          ({t("language") === "zh" ? "开发中" : "Dev"})
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGithubClick}
            className="flex items-center gap-2"
            title={t("viewOnGithub")}
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">{t("sourceCode")}</span>
          </Button>
          <LanguageSwitcher />
        </div>
      </div>

      {/* Subtitle */}
      <div className="text-center">
        <p className="text-muted-foreground">{t("modelDescriptions." + selectedModel)}</p>
      </div>

      {/* Calculator Content */}
      <div key={selectedModel}>{renderCalculator()}</div>
    </div>
  )
}

export default function Page() {
  return (
    <LanguageProvider>
      <MainContent />
    </LanguageProvider>
  )
}
