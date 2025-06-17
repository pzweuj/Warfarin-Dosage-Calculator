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
  enzymeInducer: string
  amiodarone: string
  targetINR: string
}

export function IWPCCalculator() {
  const { t } = useLanguage()

  const [patientData, setPatientData] = useState<PatientData>({
    age: "",
    height: "",
    weight: "",
    race: "",
    cyp2c9: "",
    vkorc1: "",
    enzymeInducer: "no",
    amiodarone: "no",
    targetINR: "2.5",
  })

  useEffect(() => {
    // 当组件重新挂载时重置表单数据
    setPatientData({
      age: "",
      height: "",
      weight: "",
      race: "",
      cyp2c9: "",
      vkorc1: "",
      enzymeInducer: "no",
      amiodarone: "no",
      targetINR: "2.5",
    })
    setResult(null)
  }, [])

  const [result, setResult] = useState<{
    weeklyDose: number
    dailyDose: number
  } | null>(null)

  const calculateDose = () => {
    const age = Number.parseFloat(patientData.age)
    const height = Number.parseFloat(patientData.height)
    const weight = Number.parseFloat(patientData.weight)

    if (!age || !height || !weight || !patientData.race || !patientData.cyp2c9 || !patientData.vkorc1) {
      alert(t("validation.fillRequired"))
      return
    }

    // IWPC公式系数
    let dose = 5.6044

    // 年龄 (每十年)
    dose -= 0.2614 * (age / 10)

    // 身高 (cm)
    dose += 0.0087 * height

    // 体重 (kg)
    dose += 0.0128 * weight

    // VKORC1基因型
    if (patientData.vkorc1 === "AG") dose -= 0.8677
    else if (patientData.vkorc1 === "AA") dose -= 1.6974
    else if (patientData.vkorc1 === "unknown") dose -= 0.4854

    // CYP2C9基因型
    if (patientData.cyp2c9 === "*1/*2") dose -= 0.5211
    else if (patientData.cyp2c9 === "*1/*3") dose -= 0.9357
    else if (patientData.cyp2c9 === "*2/*2") dose -= 1.0616
    else if (patientData.cyp2c9 === "*2/*3") dose -= 1.9206
    else if (patientData.cyp2c9 === "*3/*3") dose -= 2.3312
    else if (patientData.cyp2c9 === "unknown") dose -= 0.2188

    // 种族
    if (patientData.race === "asian") dose -= 0.1092
    else if (patientData.race === "black") dose -= 0.276
    else if (patientData.race === "mixed") dose -= 0.1032

    // 酶诱导剂
    if (patientData.enzymeInducer === "yes") dose += 1.1816

    // 胺碘酮
    if (patientData.amiodarone === "yes") dose -= 0.5503

    // 计算最终剂量 (mg/week)
    const weeklyDose = Math.exp(dose)
    const dailyDose = weeklyDose / 7

    setResult({
      weeklyDose: Math.round(weeklyDose * 10) / 10,
      dailyDose: Math.round(dailyDose * 10) / 10,
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
              <Label htmlFor="targetINR">{t("targetINR")}</Label>
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
              <Label htmlFor="enzymeInducer">{t("enzymeInducer")}</Label>
              <Select
                value={patientData.enzymeInducer}
                onValueChange={(value) => handleInputChange("enzymeInducer", value)}
              >
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
            <div className="grid md:grid-cols-2 gap-4 text-center">
              <div className="space-y-2">
                <Label className="text-lg font-semibold">{t("weeklyDose")}</Label>
                <div className="text-3xl font-bold text-green-700">
                  {result.weeklyDose} <span className="text-lg">mg/{t("language") === "zh" ? "周" : "week"}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-lg font-semibold">{t("dailyDose")}</Label>
                <div className="text-3xl font-bold text-green-700">
                  {result.dailyDose} <span className="text-lg">mg/{t("language") === "zh" ? "日" : "day"}</span>
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
            {t("models.iwpc")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>{t("aboutIwpc")}</p>
          <div className="space-y-2">
            <p>
              <strong>{t("factors")}</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              {(t("factorsList") as string[]).map((factor: string, index: number) => (
                <li key={index}>{factor}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="outline">{t("language") === "zh" ? "临床决策支持" : "Clinical Decision Support"}</Badge>
            <Badge variant="outline">{t("language") === "zh" ? "个体化医疗" : "Personalized Medicine"}</Badge>
            <Badge variant="outline">{t("language") === "zh" ? "药物基因组学" : "Pharmacogenomics"}</Badge>
          </div>
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm">
              <strong>{t("reference")}</strong>
              <a
                href="https://www.nejm.org/doi/full/10.1056/NEJMoa0809329"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-blue-600 hover:text-blue-800 underline"
              >
                Estimation of the Warfarin Dose with Clinical and Pharmacogenetic Data
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
