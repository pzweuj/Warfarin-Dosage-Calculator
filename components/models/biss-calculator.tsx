"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Calculator, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useLanguage } from "../../contexts/language-context"

interface PatientData {
  height: string
  vkorc1: string
  cyp2c9_2_alleles: string
  cyp2c9_3_alleles: string
  indication: string
}

export function BissCalculator() {
  const { t } = useLanguage()

  const [patientData, setPatientData] = useState<PatientData>({
    height: "",
    vkorc1: "",
    cyp2c9_2_alleles: "0",
    cyp2c9_3_alleles: "0",
    indication: "other",
  })

  const [result, setResult] = useState<{
    dailyDose: number
    weeklyDose: number
  } | null>(null)

  useEffect(() => {
    // 当组件重新挂载时重置表单数据
    setPatientData({
      height: "",
      vkorc1: "",
      cyp2c9_2_alleles: "0",
      cyp2c9_3_alleles: "0",
      indication: "other",
    })
    setResult(null)
  }, [])

  const calculateDose = () => {
    const height = Number.parseFloat(patientData.height)
    const cyp2c9_2_alleles = Number.parseFloat(patientData.cyp2c9_2_alleles)
    const cyp2c9_3_alleles = Number.parseFloat(patientData.cyp2c9_3_alleles)

    if (!height || !patientData.vkorc1) {
      alert(t("validation.fillRequired"))
      return
    }

    // Biss模型公式: 初始剂量（mg/d） = － 0.009 + 0.011 × 身高（cm） + 0.357 × VKORC1（AA 0；AG 1；GG 2） － 0.478 × CYP2C9*3（*3 等位基因数：0，1，2） － 0.277 × （CYP2C9*2）（*2 等位基因数：0，1，2） + 0.186 × 适应症（Fontan 手术：0；其他：1)

    let dose = -0.009

    // 身高
    dose += 0.011 * height

    // VKORC1基因型 (AA=0, AG=1, GG=2)
    let vkorc1Score = 0
    if (patientData.vkorc1 === "AG") vkorc1Score = 1
    else if (patientData.vkorc1 === "GG") vkorc1Score = 2
    dose += 0.357 * vkorc1Score

    // CYP2C9*3等位基因数 (0, 1, 2)
    dose -= 0.478 * cyp2c9_3_alleles

    // CYP2C9*2等位基因数 (0, 1, 2)
    dose -= 0.277 * cyp2c9_2_alleles

    // 适应症 (Fontan手术=0, 其他=1)
    const indicationScore = patientData.indication === "fontan" ? 0 : 1
    dose += 0.186 * indicationScore

    // 计算最终剂量 (mg/day)
    const dailyDose = Math.max(0, dose) // 确保剂量不为负数
    const weeklyDose = dailyDose * 7

    setResult({
      dailyDose: Math.round(dailyDose * 100) / 100,
      weeklyDose: Math.round(weeklyDose * 100) / 100,
    })
  }

  const handleInputChange = (field: keyof PatientData, value: string) => {
    setPatientData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="space-y-6">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>{t("warning")}：</strong>
          {t("warningText")}
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("patientInfo")}</CardTitle>
            <CardDescription>{t("patientInfoDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="height">
                {t("height")} ({t("heightUnit")}) *
              </Label>
              <Input
                id="height"
                type="number"
                placeholder="170"
                value={patientData.height}
                onChange={(e) => handleInputChange("height", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="indication">{t("indication")} *</Label>
              <Select value={patientData.indication} onValueChange={(value) => handleInputChange("indication", value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t("indication")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fontan">{t("indications.fontan")}</SelectItem>
                  <SelectItem value="other">{t("indications.other")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("genetics")}</CardTitle>
            <CardDescription>{t("geneticsDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vkorc1">{t("vkorc1")} *</Label>
              <Select value={patientData.vkorc1} onValueChange={(value) => handleInputChange("vkorc1", value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t("vkorc1")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AA">{t("genotypes.vkorc1.AA")}</SelectItem>
                  <SelectItem value="AG">{t("genotypes.vkorc1.AG")}</SelectItem>
                  <SelectItem value="GG">{t("genotypes.vkorc1.GG")}</SelectItem>
                  <SelectItem value="unknown">{t("unknown")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cyp2c9_2_alleles">{t("cyp2c9_2_alleles")}</Label>
              <Select
                value={patientData.cyp2c9_2_alleles}
                onValueChange={(value) => handleInputChange("cyp2c9_2_alleles", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cyp2c9_3_alleles">{t("cyp2c9_3_alleles")}</Label>
              <Select
                value={patientData.cyp2c9_3_alleles}
                onValueChange={(value) => handleInputChange("cyp2c9_3_alleles", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Button onClick={calculateDose} size="lg" className="px-8">
          <Calculator className="w-4 h-4 mr-2" />
          {t("calculate")}
        </Button>
      </div>

      {result && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <Info className="w-5 h-5" />
              {t("result")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-center">
              <div className="space-y-2">
                <Label className="text-lg font-semibold">{t("dailyDose")}</Label>
                <div className="text-3xl font-bold text-green-700">
                  {result.dailyDose} <span className="text-lg">mg/{t("language") === "zh" ? "日" : "day"}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-lg font-semibold">{t("weeklyDose")}</Label>
                <div className="text-3xl font-bold text-green-700">
                  {result.weeklyDose} <span className="text-lg">mg/{t("language") === "zh" ? "周" : "week"}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>{t("warning")}：</strong>
                {t("resultNote")}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            {t("about")}
            {t("models.biss")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>{t("aboutBiss")}</p>
          <div className="space-y-2">
            <p>
              <strong>{t("factors")}</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              {(t("bissFactorsList") as string[]).map((factor: string, index: number) => (
                <li key={index}>{factor}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="outline">{t("language") === "zh" ? "儿科患者" : "Pediatric Patients"}</Badge>
            <Badge variant="outline">{t("language") === "zh" ? "Fontan手术" : "Fontan Surgery"}</Badge>
            <Badge variant="outline">{t("language") === "zh" ? "等位基因计数" : "Allele Counting"}</Badge>
            <Badge variant="outline">{t("language") === "zh" ? "药物基因组学" : "Pharmacogenomics"}</Badge>
          </div>
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm">
              <strong>{t("reference")}</strong>
              <a
                href="https://pubmed.ncbi.nlm.nih.gov/22010099/"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-blue-600 hover:text-blue-800 underline"
              >
                VKORC1 and CYP2C9 genotype and patient characteristics explain a large proportion of the variability in warfarin dose requirement among children
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
