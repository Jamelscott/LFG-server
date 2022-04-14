require('dotenv').config()
const express = require('express')
const router = express.Router()
const db = require('../models')
const { route } = require('./users')

// List all parties
router.get('/', async (req, res) => {
    try {
        const listParties = await db.Party.find({})
        res.json(listParties)
    } catch (error) {
        console.log(error)
        res.status(503).json({ msg: `An error occured. ${error}` })
    }
})

// 
router.get('/:id', async (req, res)=> {
    try {
        const findParties = await db.Party.find({ gameId : req.params.id })
        res.json(findParties)
    } catch (error) {
        
    }
})
// TODO : push author id to membersSchema
//CREATE NEW PARTY
router.post('/:id', async (req, res) => {
    try {
        const partyCreated = await db.Party.create(req.body)
        console.log(partyCreated)
        res.json(partyCreated)
    } catch (error) {
        res.status(503).json({ msg: `An error occured. ${error}` })
    }
})

// Update party
router.put('/:id', async (req, res) => {
    try {
        const partyUpdated = await db.Party.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        res.json(partyUpdated)
    } catch (error) {
        res.status(503).json({ msg: `An error occured.${error}` })
    }
})

// Request to join party -- will be pushed to requestsSchema
// TODO : check if userid already exists in the requestsSchema
router.put('/:id/request', async (req, res) => {
    try {
        const newRequest = await db.Party.findById(req.params.id)
        newRequest.requests.push(req.body)
        newRequest.save()
        return res.status(200).json({ msg: 'Request submitted.' })
    } catch (error) {
        res.status(503).json({ msg: `An error occured. ${error}` })
    }
})

router.get('/:id/request', async (req, res) => {
    try {
        const pendingRequests = await db.Party.findById(req.params.id)
        res.json(pendingRequests)
    } catch (error) {
        res.status(503).json({ msg: `An error occured. ${error}` })
    }
})

// Approve application to join party  -- will be pushed to membersSchema
// TODO : delete request once
router.put('/:id/approve', async (req, res) => {
    try {
        const foundParty = await db.Party.findById(req.params.id)
        foundParty.members.push(req.body)
        foundParty.requests.pop(req.body)
        foundParty.save()
        return res.status(200).json({ msg: 'User approved.' })
    } catch (error) {
        res.status(503).json({ msg: `An error occured. ${error} ${req.params.id}` })
    }
})



module.exports = router
