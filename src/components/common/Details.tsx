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
  imageKey?: string
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
  imageKey 
}: DetailsProps) {
  if (!data) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl text-gray-900 dark:text-white transition-colors">{title}</DialogTitle>
          <DialogDescription className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 sm:space-y-6">
          {imageKey && (
            <div className="flex justify-center">
              <img 
                src={getNestedValue(data, imageKey)} 
                alt={title}
                className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg"
              />
            </div>
          )}
          
          {sections.map((section, sectionIndex) => (
            <div key={section.title}>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 sm:mb-3 transition-colors">{section.title}</h3>
              <div className={section.fields.length > 2 ? "grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4" : "space-y-3"}>
                {section.fields.map((field) => {
                  const value = getNestedValue(data, field.key) || field.fallback
                  return (
                    <div key={field.key} className={field.span === 2 ? "sm:col-span-2" : ""}>
                      <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors">{field.label}</span>
                      {field.badge ? (
                        <div className="mt-1">
                          <Badge variant={field.variant as any || "secondary"} className="capitalize text-xs">
                            {value}
                          </Badge>
                        </div>
                      ) : (
                        <p className={`text-sm font-medium break-words text-gray-900 dark:text-gray-200 transition-colors ${field.mono ? 'font-mono' : ''}`}>
                          {field.prefix || ''}{value}{field.suffix || ''}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
              {sectionIndex < sections.length - 1 && <Separator className="mt-4 sm:mt-6" />}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
       
  
