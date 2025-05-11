const defaultParticipants = [1, 2, 4, 5];

export const emptyForm = () => ({
    date: new Date(),
    participations: defaultParticipants.map(
        p => ({ participant: p })
    ),
    name: '',
    organizers: []
});
