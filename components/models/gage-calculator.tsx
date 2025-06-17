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
  race: string
  cyp2c9: string
  vkorc1: string
  amiodarone: string
  targetINR: string
  smoking: string
  dvtPe: string
}

export function GageCalculator() {
  const { t } = useLanguage()

  const [patientData, setPatientData] = useState<PatientData>({
    age: "",
    height: "",
    weight: "",
    race: "",
    cyp2c9: "",
    vkorc1: "",
    amiodarone: "no",
    targetINR: "2.5",
    smoking: "no",
    dvtPe: "no",
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
      race: "",
      cyp2c9: "",
      vkorc1: "",
      amiodarone: "no",
      targetINR: "2.5",
      smoking: "no",
      dvtPe: "no",
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
    const targetINR = Number.parseFloat(patientData.targetINR)

    if (!age || !height || !weight || !patientData.race || !patientData.cyp2c9 || !patientData.vkorc1) {
      alert(t("validation.fillRequired"))
      return
    }

    // 计算体表面积
    const bsa = calculateBSA(height, weight)

    // Gage模型公式
    let dose = 0.9751

    // VKORC1基因型 (AG=1, AA=1, GG=0)
    if (patientData.vkorc1 === "AG" || patientData.vkorc1 === "AA") {
      dose -= 0.3238
    }

    // 体表面积
    dose += 0.4317 * bsa

    // CYP2C9*3 (如果包含*3变异则为1，否则为0)
    if (patientData.cyp2c9.includes("*3")) {
      dose -= 0.4008
    }

    // 年龄
    dose -= 0.00745 * age

    // CYP2C9*2 (如果包含*2变异则为1，否则为0)
    if (patientData.cyp2c9.includes("*2")) {
      dose -= 0.2066
    }

    // 目标INR值
    dose += 0.2029 * targetINR

    // 胺碘酮
    if (patientData.amiodarone === "yes") {
      dose -= 0.2538
    }

    // 吸烟
    if (patientData.smoking === "yes") {
      dose += 0.0922
    }

    // 非洲人或非裔美国人
    if (patientData.race === "black") {
      dose -= 0.0901
    }

    // 深静脉血栓/肺栓塞
    if (patientData.dvtPe === "yes") {
      dose += 0.0664
    }

    // 计算最终剂量 (mg/day)
    const dailyDose = Math.exp(dose)
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

            <div className="space-y-2">
              <Label htmlFor="race">{t("race")} *</Label>
              <Select value={patientData.race} onValueChange={(value) => handleInputChange("race", value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t("race")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="white">{t("races.white")}</SelectItem>
                  <SelectItem value="asian">{t("races.asian")}</SelectItem>
                  <SelectItem value="black">{t("races.black")}</SelectItem>
                  <SelectItem value="mixed">{t("races.mixed")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetINR">{t("targetINR")} *</Label>
              <Select value={patientData.targetINR} onValueChange={(value) => handleInputChange("targetINR", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2.0">2.0</SelectItem>
                  <SelectItem value="2.5">2.5</SelectItem>
                  <SelectItem value="3.0">3.0</SelectItem>
                  <SelectItem value="3.5">3.5</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="smoking">{t("smoking")}</Label>
              <Select value={patientData.smoking} onValueChange={(value) => handleInputChange("smoking", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">{t("no")}</SelectItem>
                  <SelectItem value="yes">{t("yes")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dvtPe">{t("dvtPe")}</Label>
              <Select value={patientData.dvtPe} onValueChange={(value) => handleInputChange("dvtPe", value)}>
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
              <Label htmlFor="cyp2c9">{t("cyp2c9")} *</Label>
              <Select value={patientData.cyp2c9} onValueChange={(value) => handleInputChange("cyp2c9", value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t("cyp2c9")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="*1/*1">{t("genotypes.cyp2c9.1_1")}</SelectItem>
                  <SelectItem value="*1/*2">{t("genotypes.cyp2c9.1_2")}</SelectItem>
                  <SelectItem value="*1/*3">{t("genotypes.cyp2c9.1_3")}</SelectItem>
                  <SelectItem value="*2/*2">{t("genotypes.cyp2c9.2_2")}</SelectItem>
                  <SelectItem value="*2/*3">{t("genotypes.cyp2c9.2_3")}</SelectItem>
                  <SelectItem value="*3/*3">{t("genotypes.cyp2c9.3_3")}</SelectItem>
                  <SelectItem value="unknown">{t("unknown")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vkorc1">{t("vkorc1")} *</Label>
              <Select value={patientData.vkorc1} onValueChange={(value) => handleInputChange("vkorc1", value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t("vkorc1")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GG">{t("genotypes.vkorc1.GG")}</SelectItem>
                  <SelectItem value="AG">{t("genotypes.vkorc1.AG")}</SelectItem>
                  <SelectItem value="AA">{t("genotypes.vkorc1.AA")}</SelectItem>
                  <SelectItem value="unknown">{t("unknown")}</SelectItem>
                </SelectContent>
              </Select>
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
            {t("models.gage")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>{t("aboutGage")}</p>
          <div className="space-y-2">
            <p>
              <strong>{t("factors")}</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              {(t("gageFactorsList") as string[]).map((factor: string, index: number) => (
                <li key={index}>{factor}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="outline">{t("language") === "zh" ? "体表面积计算" : "BSA Calculation"}</Badge>
            <Badge variant="outline">{t("language") === "zh" ? "临床因素" : "Clinical Factors"}</Badge>
            <Badge variant="outline">{t("language") === "zh" ? "药物基因组学" : "Pharmacogenomics"}</Badge>
          </div>
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm">
              <strong>{t("reference")}</strong>
              <a
                href="https://pmc.ncbi.nlm.nih.gov/articles/PMC2683977/"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-blue-600 hover:text-blue-800 underline"
              >
                Use of pharmacogenetic and clinical factors to predict the therapeutic dose of warfarin
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
