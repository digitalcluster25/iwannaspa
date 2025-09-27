import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

export function OfferPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl mb-4">Публичная оферта</h1>
        <p className="text-muted-foreground">
          Условия использования платформы Iwanna
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Общие положения</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Настоящая публичная оферта определяет условия использования
              платформы :after для поиска и бронирования СПА-услуг.
            </p>
            <p>
              Используя наш сервис, вы соглашаетесь с условиями данной оферты.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Предмет соглашения</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Компания :after предоставляет информационные услуги по поиску
              СПА-комплексов в городах Киев, Одесса, Львов и Буковель.
            </p>
            <p>
              Платформа выступает посредником между пользователями и
              поставщиками СПА-услуг.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Права и обязанности пользователя</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              <strong>Пользователь имеет право:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Использовать платформу для поиска СПА-услуг</li>
              <li>Получать актуальную информацию о СПА-комплексах</li>
              <li>Оставлять отзывы о посещенных заведениях</li>
            </ul>

            <p>
              <strong>Пользователь обязуется:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Предоставлять достоверную информацию</li>
              <li>Соблюдать правила использования платформы</li>
              <li>Не нарушать права третьих лиц</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Ответственность</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Компания :after не несет ответственности за качество услуг,
              предоставляемых СПА-комплексами.
            </p>
            <p>
              Все споры решаются непосредственно между пользователем и
              поставщиком услуг.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Персональные данные</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Мы обязуемся защищать персональные данные пользователей в
              соответствии с действующим законодательством Украины.
            </p>
            <p>
              Персональные данные используются исключительно для предоставления
              услуг платформы.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Заключительные положения</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Настоящая оферта вступает в силу с момента начала использования
              платформы.
            </p>
            <p>
              Компания оставляет за собой право изменять условия оферты с
              предварительным уведомлением пользователей.
            </p>
            <p className="text-muted-foreground text-sm">
              Последнее обновление: 25 сентября 2024 года
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
