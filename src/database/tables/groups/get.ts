import {Group} from "@diary-spo/types";
import createQueryBuilder from "@diary-spo/sql";
import {client} from "@db";

export const getGroupInfo = async (
    groupId: number
): Promise<Group | null> => createQueryBuilder<Group>(client)
    .select('*')
    .from('groups')
    .where(`id = ${Number(groupId)}`)
    .first()