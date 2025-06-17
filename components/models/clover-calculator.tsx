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
  age: string
  height: string
  weight: string
  gender: string
  vkorc1: string
  cyp2c9: string
  amiodarone: string
}

export function CloverCalculator() {
  const { t } = useLanguage()

  const [patientData, setPatientData] = useState<PatientData>({
    age: "",
    height: "",
    weight: "",
    gender: "",
    vkorc1: "",
    cyp2c9: "",
    amiodarone: "no",
  })

  const [result, setResult] = useState<{
    dailyDose: number
    weeklyDose: number
    bsa: number
  } | null>(null)

  useEffect(() => {
    // 当组件重新挂载时重置表单数据
    setPatientData({
      age: "",
      height: "",
      weight: "",
      gender: "",
      vkorc1: "",
      cyp2c9: "",
      amiodarone: "no",
    })
    setResult(null)
  }, [])

  // 计算体表面积 (Mosteller公式)
  const calculateBSA = (height: number, weight: number): number => {
    return Math.sqrt((height * weight) / 3600)
  }

  const calculateDose = () => {
    const age = Number.parseFloat(patientData.age)
    const height = Number.parseFloat(patientData.height)
    const weight = Number.parseFloat(patientData.weight)

    if (!age || !height || !weight || !patientData.gender || !patientData.vkorc1 || !patientData.cyp2c9) {
      alert(t("validation.fillRequired"))
      return
    }

    // 计算体表面积
    const bsa = calculateBSA(height, weight)

    // 苜蓿草模型公式: 初始剂量（mg/d） = ［1.346 + 0.350 × （VKORC1 － 1639G > A：AA 为 1、GA 为 2、GG 为 3） － 0.273 × （CYP2C9*3：*1/*1 为 1、*1/*3 为 2、*3/*3 为 3） + 0.245 × （体表面积） － 0.003 × （年龄） － 0.036 × （胺碘酮：是 1、否 0） + 0.021 × （男性 1；女性 2）］^ 2

    let dose = 1.346

    // VKORC1基因型 (AA=1, GA=2, GG=3)
    let vkorc1Score = 0
    if (patientData.vkorc1 === "AA") vkorc1Score = 1
    else if (patientData.vkorc1 === "AG") vkorc1Score = 2
    else if (patientData.vkorc1 === "GG") vkorc1Score = 3
    dose += 0.35 * vkorc1Score

    // CYP2C9*3 (*1/*1=1, *1/*3=2, *3/*3=3)
    let cyp2c9Score = 0
    if (patientData.cyp2c9 === "*1/*1") cyp2c9Score = 1
    else if (patientData.cyp2c9 === "*1/*3") cyp2c9Score = 2
    else if (patientData.cyp2c9 === "*3/*3") cyp2c9Score = 3
    dose -= 0.273 * cyp2c9Score

    // 体表面积
    dose += 0.245 * bsa

    // 年龄
    dose -= 0.003 * age

    // 胺碘酮 (是=1, 否=0)
    if (patientData.amiodarone === "yes") {
      dose -= 0.036
    }

    // 性别 (男性=1, 女性=2)
    const genderScore = patientData.gender === "male" ? 1 : 2
    dose += 0.021 * genderScore

    // 计算最终剂量 (平方)
    const dailyDose = Math.pow(dose, 2)
    const weeklyDose = dailyDose * 7

    setResult({
      dailyDose: Math.round(dailyDose * 10) / 10,
      weeklyDose: Math.round(weeklyDose * 10) / 10,
      bsa: Math.round(bsa * 100) / 100,
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">
                  {t("age")} ({t("ageUnit")}) *
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="65"
                  value={patientData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">{t("gender")} *</Label>
                <Select value={patientData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("gender")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{t("genders.male")}</SelectItem>
                    <SelectItem value="female">{t("genders.female")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="weight">
                  {t("weight")} ({t("weightUnit")}) *
                </Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="70"
                  value={patientData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amiodarone">{t("amiodarone")}</Label>
              <Select value={patientData.amiodarone} onValueChange={(value) => handleInputChange("amiodarone", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">{t("no")}</SelectItem>
                  <SelectItem value="yes">{t("yes")}</SelectItem>
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
              <Label htmlFor="cyp2c9">CYP2C9*3 {t("language") === "zh" ? "基因型" : "Genotype"} *</Label>
              <Select value={patientData.cyp2c9} onValueChange={(value) => handleInputChange("cyp2c9", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="CYP2C9*3" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="*1/*1">*1/*1</SelectItem>
                  <SelectItem value="*1/*3">*1/*3</SelectItem>
                  <SelectItem value="*3/*3">*3/*3</SelectItem>
                  <SelectItem value="unknown">{t("unknown")}</SelectItem>
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
            <div className="grid md:grid-cols-3 gap-4 text-center">
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
              <div className="space-y-2">
                <Label className="text-lg font-semibold">{t("bsa")}</Label>
                <div className="text-2xl font-bold text-blue-700">
                  {result.bsa} <span className="text-lg">{t("bsaUnit")}</span>
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
            {t("models.clover")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>{t("aboutClover")}</p>
          <div className="space-y-2">
            <p>
              <strong>{t("factors")}</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              {(t("cloverFactorsList") as string[]).map((factor: string, index: number) => (
                <li key={index}>{factor}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="outline">{t("language") === "zh" ? "性别差异" : "Gender Differences"}</Badge>
            <Badge variant="outline">{t("language") === "zh" ? "体表面积" : "Body Surface Area"}</Badge>
            <Badge variant="outline">{t("language") === "zh" ? "药物基因组学" : "Pharmacogenomics"}</Badge>
            <Badge variant="outline">{t("language") === "zh" ? "苜蓿草算法" : "Clover Algorithm"}</Badge>
          </div>
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm">
              <strong>{t("reference")}</strong>
              <a
                href="https://pubmed.ncbi.nlm.nih.gov/34453556/"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-blue-600 hover:text-blue-800 underline"
              >
                To establish a model for the prediction of initial standard and maintenance doses of warfarin for the Han Chinese population based on gene polymorphism: a multicenter study
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
