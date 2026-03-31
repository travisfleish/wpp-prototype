import { NextResponse } from 'next/server'
import { runQuery } from '@/lib/snowflake'

export async function GET() {
  try {
    const rows = await runQuery(`
      SELECT
        comm.COMMUNITY                                        AS communityName,
        comm.FAN_COUNT                                        AS fanCount,
        gp.FAN_COUNT                                          AS totalFans,
        ROUND(comm.FAN_COUNT / gp.FAN_COUNT * 100, 2)        AS percentFans,
        ROUND((comm.TRANSACTIONS_PER_FAN 
          / gp.TRANSACTIONS_PER_FAN) * 100, 1)               AS purchasesPerFanIndex,
        ROUND((
          (comm.FAN_COUNT / gp.FAN_COUNT * 100) +
          ((comm.TRANSACTIONS_PER_FAN / gp.TRANSACTIONS_PER_FAN) * 100)
        ) / 2, 1)                                            AS compositeIndex
      FROM SILAB.FJ_PROD.F_SUMMARY_FS_COMMUNITY comm
      CROSS JOIN SILAB.FJ_PROD.F_SUMMARY_FS gp
      JOIN SILAB.FJ_PROD.D_MERCHANT_COMMUNITY_MAP map
        ON map.COMMUNITY = comm.COMMUNITY
        AND map.MERCHANT = 'starbucks'
        AND map.IS_HIDDEN = FALSE
      ORDER BY percentFans DESC
      LIMIT 20
    `)
    return NextResponse.json({ success: true, rowCount: rows.length, rows })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
