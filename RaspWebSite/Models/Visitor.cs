namespace RaspWebSite.Models
{
    public class Visitor
    {

        public Guid Id { get; set; }
        public required string IP { get; set; }
        public int Visits { get; set; }
        public DateTime LastVisit { get; set; }

    }
}
