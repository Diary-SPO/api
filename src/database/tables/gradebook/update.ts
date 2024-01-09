import {GradebookDB, Schedule} from "@diary-spo/types";
import {Lesson} from "@diary-spo/shared";
import createQueryBuilder from "@diary-spo/sql";
import {client} from "@db";
import {saveGradebook} from "./save";
import {updateLessonType} from "../lessonType";

export const updateGradebook = async (
    schedule: Schedule,
    lesson: Lesson
) => {
    const existGradebookQueryBuilder = createQueryBuilder<GradebookDB>(client)
        .select('*')
        .where(`"scheduleId" = ${schedule.id}`)
        .from('gradebook')

    let existGradebook: GradebookDB | null = await existGradebookQueryBuilder.first()

    if (!existGradebook) {
        existGradebook = await saveGradebook(schedule, lesson)
    } else {

        // Повторяется в gradebook/save. Нужно вынести
        if (!lesson.gradebook?.lessonType) {
            console.error(`Не удалось сохранить тип для gradebook при обновлении: отсутствует lessonType!`)
            return
        }

        const lessonType = await updateLessonType(lesson.gradebook.lessonType.toString())

        if (!lessonType) {
            console.error(`Не удалось сохранить lessonType!`)
            return
        }

        existGradebook = (await existGradebookQueryBuilder.update({
            lessonTypeId: lessonType.id
        }))?.[0] ?? null
    }

    // Дальше нужно обновить темы, задания, типы задания, обязательность заданий
}