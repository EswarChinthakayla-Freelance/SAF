import React from 'react'
import { ConciergeContactStrip, type ConciergeContactStripProps } from './ConciergeContactStrip'

export type ContactInformationProps = ConciergeContactStripProps

/**
 * ContactInformation — Forwarding wrapper to ConciergeContactStrip
 * Retains backwards compatibility for any external consumers.
 */
export const ContactInformation: React.FC<ContactInformationProps> = (props) => {
  return <ConciergeContactStrip {...props} />
}

export default ContactInformation
