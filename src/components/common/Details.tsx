import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separetor"

interface FieldConfig {
  label: string
  key: string
  span?: number
  prefix?: string
  suffix?: string
  badge?: boolean
  variant?: string
  mono?: boolean
  fallback?: string
}

interface SectionConfig {
  title: string
  fields: FieldConfig[]
}

interface DetailsProps {
  data: any
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  sections: SectionConfig[]
  // imageKey?: string
}

const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

export function Details({ 
  data, 
  open, 
  onOpenChange, 
  title, 
  description, 
  sections, 
  // imageKey 
}: DetailsProps) {
  if (!data) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* {imageKey && (
            <div className="flex justify-center">
              <img 
                src={getNestedValue(data, Key)} 
                alt={title}
                className="w-32 h-32 object-cover rounded-lg"
              />
            </div>
          )} */}
          
          {sections.map((section, sectionIndex) => (
            <div key={section.title}>
              <h3 className="text-sm font-medium text-gray-500 mb-3">{section.title}</h3>
              <div className={section.fields.length > 2 ? "grid grid-cols-2 gap-4" : "space-y-3"}>
                {section.fields.map((field) => {
                  const value = getNestedValue(data, field.key) || field.fallback
                  return (
                    <div key={field.key} className={field.span === 2 ? "col-span-2" : ""}>
                      <span className="text-xs text-gray-500">{field.label}</span>
                      {field.badge ? (
                        <div className="mt-1">
                          <Badge variant={field.variant as any || "secondary"} className="capitalize">
                            {value}
                          </Badge>
                        </div>
                      ) : (
                        <p className={`text-sm font-medium ${field.mono ? 'font-mono' : ''}`}>
                          {field.prefix || ''}{value}{field.suffix || ''}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
              {sectionIndex < sections.length - 1 && <Separator className="mt-6" />}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}